import { writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { STORAGE_KEY } from "@/config/constants/api-defaults";
import { CephStudy, ClinicianRef } from "@/types";
import { createEmptyStudy } from "@/utils/helpers";
import { addAudit } from "./audit";
import { saveStudy } from "./studies";
import { planRadiographUpload, validateRadiograph } from "./storage";
import { uploadRadiograph } from "./radiographs";

const BACKUP_KEY = `${STORAGE_KEY}-imported-backup`;

/** Studies saved by the old localStorage-only version of the app. */
type LegacyStudy = Partial<CephStudy> & { id: string; patient: CephStudy["patient"] };

export function readLegacyStudies(): LegacyStudy[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Stable, name-free ID so re-running an interrupted import keeps patients grouped. */
async function legacyPatientId(study: LegacyStudy): Promise<string> {
  const key = (study.patient?.id || study.patient?.name || study.id).trim().toLowerCase();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return `legacy_${hex.slice(0, 20)}`;
}

/**
 * Uploads every study kept in this browser to Firestore/Storage.
 * Each study is removed from localStorage once saved (a backup copy is kept),
 * so an interrupted import can be resumed.
 */
export async function importLocalStudies(
  uid: string,
  clinician: ClinicianRef,
  onProgress?: (done: number, total: number) => void
): Promise<CephStudy[]> {
  const legacy = readLegacyStudies();
  const imported: CephStudy[] = [];

  if (!localStorage.getItem(BACKUP_KEY)) {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(legacy));
  }

  for (const [index, old] of legacy.entries()) {
    const patientId = await legacyPatientId(old);
    const base = createEmptyStudy();

    let radiograph = null;
    if (old.imageSrc) {
      const blob = await (await fetch(old.imageSrc)).blob();
      const file = new File([blob], "imported-radiograph", { type: blob.type });
      if (!validateRadiograph(file)) {
        const planned = planRadiographUpload(uid, patientId, old.id, file);
        radiograph = await uploadRadiograph(uid, patientId, old.id, file, planned);
      }
    }

    const study: CephStudy = {
      ...base,
      ...old,
      id: old.id,
      patientId,
      patient: { ...base.patient, ...old.patient },
      imageSrc: null,
      radiograph,
      clinician: {
        uid,
        name: old.patient?.doctorName?.trim() || clinician.name,
      },
      latestDetectionRunId: null,
      latestAnalysisRunId: null,
      version: 0,
      createdAt: old.createdAt ?? base.createdAt,
    };

    imported.push(await saveStudy(uid, study, undefined, clinician));

    // Drop the saved study from localStorage so a retry won't duplicate it.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy.slice(index + 1)));
    onProgress?.(index + 1, legacy.length);
  }

  localStorage.removeItem(STORAGE_KEY);

  const batch = writeBatch(db());
  addAudit(batch, uid, {
    action: "local.imported",
    entityType: "study",
    entityId: "localStorage",
    details: { count: imported.length },
  });
  await batch.commit();

  return imported;
}
