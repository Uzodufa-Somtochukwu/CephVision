import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AiRunRecord } from "@/types";
import { addAudit } from "./audit";
import { newId } from "./ids";
import { studySub } from "./paths";

/**
 * Stores an immutable record of an AI call, separate from the clinician's
 * edits. Returns the run ID immediately; `written` resolves when it's stored.
 */
export function recordAiRun(
  uid: string,
  studyId: string,
  patientId: string,
  run: Omit<AiRunRecord, "actorUid">
): { id: string; written: Promise<void> } {
  const id = newId();
  const batch = writeBatch(db());

  batch.set(doc(db(), studySub(uid, studyId, "aiRuns"), id), {
    ...run,
    actorUid: uid,
    createdAt: serverTimestamp(),
  });
  addAudit(batch, uid, {
    action: "ai.run",
    entityType: "aiRun",
    entityId: id,
    patientId,
    studyId,
    details: { type: run.type, model: run.model },
  });

  return { id, written: batch.commit() };
}
