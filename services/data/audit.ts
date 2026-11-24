import { collection, doc, serverTimestamp, type WriteBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AuditAction } from "@/types";
import { auditCol } from "./paths";

export interface AuditEntry {
  action: AuditAction;
  entityType: "study" | "patient" | "report" | "aiRun" | "radiograph";
  entityId: string;
  patientId?: string;
  studyId?: string;
  studyVersion?: number;
  details?: Record<string, unknown>;
}

/** Adds an append-only audit entry to a batch. `at` is set by the server. */
export function addAudit(batch: WriteBatch, uid: string, entry: AuditEntry) {
  const ref = doc(collection(db(), auditCol(uid)));
  batch.set(ref, {
    ...entry,
    actorUid: uid,
    at: serverTimestamp(),
  });
}
