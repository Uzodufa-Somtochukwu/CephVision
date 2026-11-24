import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "@/config/firebase";
import { CephStudy, ClinicianRef, PatientRecord, StudyRecord } from "@/types";
import { addAudit } from "./audit";
import { patientsCol, studiesCol, studySub } from "./paths";

function toStudyRecord(uid: string, study: CephStudy): StudyRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, patient, imageSrc, ...rest } = study;
  return {
    ...rest,
    ownerUid: uid,
    analysisDate: patient.date,
    deleted: false,
    deletedAt: null,
  };
}

function toCephStudy(
  id: string,
  record: StudyRecord,
  patient: PatientRecord | undefined
): CephStudy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ownerUid, analysisDate, deleted, deletedAt, ...rest } = record;
  return {
    ...rest,
    id,
    imageSrc: null,
    radiograph: record.radiograph ?? null,
    clinician: record.clinician ?? null,
    latestDetectionRunId: record.latestDetectionRunId ?? null,
    latestAnalysisRunId: record.latestAnalysisRunId ?? null,
    patient: {
      id: patient?.patientNumber ?? "",
      name: patient?.name ?? "",
      age: patient?.age ?? "",
      sex: patient?.sex ?? "",
      date: analysisDate,
      doctorName: record.clinician?.name,
    },
  };
}

/** Loads every non-deleted study for the clinician, joined with its patient. */
export async function loadStudies(uid: string): Promise<CephStudy[]> {
  const [patientSnap, studySnap] = await Promise.all([
    getDocs(
      query(collection(db(), patientsCol(uid)), where("deleted", "==", false))
    ),
    getDocs(
      query(
        collection(db(), studiesCol(uid)),
        where("deleted", "==", false),
        orderBy("updatedAt", "desc")
      )
    ),
  ]);

  const patients = new Map<string, PatientRecord>();
  patientSnap.forEach((d) => patients.set(d.id, d.data() as PatientRecord));

  return studySnap.docs.map((d) => {
    const record = d.data() as StudyRecord;
    return toCephStudy(d.id, record, patients.get(record.patientId));
  });
}

/**
 * Saves a study and its patient in one atomic batch.
 * - The previously saved state is copied to /versions/{n} first (rules enforce this).
 * - Patient changes are applied to the shared patient document and audited.
 * `previous` is the last saved copy (undefined for a study that was never saved).
 */
export async function saveStudy(
  uid: string,
  study: CephStudy,
  previous: CephStudy | undefined,
  clinician: ClinicianRef
): Promise<CephStudy> {
  const now = new Date().toISOString();
  const batch = writeBatch(db());

  /* ---- patient ---- */
  const patientRef = doc(db(), patientsCol(uid), study.patientId);
  const existingPatient = await getDoc(patientRef);
  const patientFields = {
    patientNumber: study.patient.id.trim(),
    name: study.patient.name.trim(),
    age: study.patient.age,
    sex: study.patient.sex,
  };

  if (!existingPatient.exists()) {
    batch.set(patientRef, {
      ...patientFields,
      ownerUid: uid,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    } satisfies PatientRecord);
    addAudit(batch, uid, {
      action: "patient.created",
      entityType: "patient",
      entityId: study.patientId,
      patientId: study.patientId,
    });
  } else {
    const before = existingPatient.data() as PatientRecord;
    const changed = (Object.keys(patientFields) as (keyof typeof patientFields)[])
      .filter((k) => before[k] !== patientFields[k]);

    if (changed.length || before.deleted) {
      batch.set(patientRef, {
        ...before,
        ...patientFields,
        deleted: false,
        updatedAt: now,
      } satisfies PatientRecord);
      addAudit(batch, uid, {
        action: "patient.updated",
        entityType: "patient",
        entityId: study.patientId,
        patientId: study.patientId,
        details: {
          before: Object.fromEntries(changed.map((k) => [k, before[k]])),
          after: Object.fromEntries(changed.map((k) => [k, patientFields[k]])),
        },
      });
    }
  }

  /* ---- study + version snapshot ---- */
  const studyRef = doc(db(), studiesCol(uid), study.id);
  const isNew = !previous || previous.version === 0;
  const version = isNew ? 1 : previous.version + 1;

  if (!isNew) {
    batch.set(doc(db(), studySub(uid, study.id, "versions"), String(previous.version)), {
      ...toStudyRecord(uid, previous),
      snapshotAt: serverTimestamp(),
    });
  }

  const saved: CephStudy = {
    ...study,
    clinician: study.clinician ?? clinician,
    patient: { ...study.patient, doctorName: (study.clinician ?? clinician).name },
    version,
    createdAt: isNew ? study.createdAt : previous.createdAt,
    updatedAt: now,
  };

  batch.set(studyRef, toStudyRecord(uid, saved));
  addAudit(batch, uid, {
    action: isNew ? "study.created" : "study.updated",
    entityType: "study",
    entityId: study.id,
    patientId: study.patientId,
    studyId: study.id,
    studyVersion: version,
  });

  try {
    await batch.commit();
  } catch (err) {
    throw friendlyWriteError(err);
  }

  return saved;
}

/** Soft delete: the study is hidden, a final snapshot is kept, and the action is audited. */
export async function softDeleteStudy(uid: string, study: CephStudy): Promise<void> {
  if (study.version === 0) return; // never saved, nothing stored

  const now = new Date().toISOString();
  const batch = writeBatch(db());

  batch.set(doc(db(), studySub(uid, study.id, "versions"), String(study.version)), {
    ...toStudyRecord(uid, study),
    snapshotAt: serverTimestamp(),
  });
  batch.update(doc(db(), studiesCol(uid), study.id), {
    deleted: true,
    deletedAt: now,
    updatedAt: now,
    version: study.version + 1,
  });
  addAudit(batch, uid, {
    action: "study.deleted",
    entityType: "study",
    entityId: study.id,
    patientId: study.patientId,
    studyId: study.id,
    studyVersion: study.version + 1,
  });

  try {
    await batch.commit();
  } catch (err) {
    throw friendlyWriteError(err);
  }
}

function friendlyWriteError(err: unknown): Error {
  if (err instanceof FirebaseError && err.code === "permission-denied") {
    return new Error(
      "This analysis was changed in another window or tab. Reload the page and try again."
    );
  }
  return err instanceof Error ? err : new Error("Failed to save to the database.");
}
