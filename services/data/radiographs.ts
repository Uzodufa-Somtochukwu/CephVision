import { writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { RadiographRef } from "@/types";
import { addAudit } from "./audit";
import { uploadToPath } from "./storage";

export async function uploadRadiograph(
  uid: string,
  patientId: string,
  studyId: string,
  file: Blob,
  planned: RadiographRef
): Promise<RadiographRef> {
  await uploadToPath(planned.storagePath, file, planned.contentType);

  const batch = writeBatch(db());
  addAudit(batch, uid, {
    action: "radiograph.uploaded",
    entityType: "radiograph",
    entityId: planned.storagePath,
    patientId,
    studyId,
    details: { sizeBytes: planned.sizeBytes, contentType: planned.contentType },
  });
  await batch.commit();

  return planned;
}
