import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CephStudy, ReportRecord } from "@/types";
import { addAudit } from "./audit";
import { newId } from "./ids";
import { reportPath, studySub } from "./paths";
import { uploadToPath } from "./storage";

/** Keeps a copy of every PDF given out, tied to the study version it was made from. */
export async function saveReport(
  uid: string,
  study: CephStudy,
  pdf: Blob,
  fileName: string
): Promise<string> {
  const reportId = newId();
  const path = reportPath(uid, study.patientId, study.id, reportId);

  await uploadToPath(path, pdf, "application/pdf");

  const batch = writeBatch(db());
  batch.set(doc(db(), studySub(uid, study.id, "reports"), reportId), {
    storagePath: path,
    fileName,
    sizeBytes: pdf.size,
    studyVersion: study.version,
    actorUid: uid,
    createdAt: serverTimestamp(),
  } satisfies ReportRecord & { createdAt: unknown });
  addAudit(batch, uid, {
    action: "report.generated",
    entityType: "report",
    entityId: reportId,
    patientId: study.patientId,
    studyId: study.id,
    studyVersion: study.version,
  });
  await batch.commit();

  return reportId;
}
