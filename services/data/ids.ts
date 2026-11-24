import { collection, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

/** Firestore-style random ID, generated locally (no network). */
export function newId(): string {
  return doc(collection(db(), "_ids")).id;
}
