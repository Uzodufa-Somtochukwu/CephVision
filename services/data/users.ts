import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/config/firebase";
import { UserProfile } from "@/types";
import { userDoc } from "./paths";

/** Creates the clinician profile if it doesn't exist yet. */
export async function ensureUserProfile(user: User, displayName?: string) {
  const ref = doc(db(), userDoc(user.uid));
  const snap = await getDoc(ref);
  const now = new Date().toISOString();

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? "",
      displayName: displayName ?? user.displayName ?? "",
      createdAt: now,
      updatedAt: now,
    } satisfies UserProfile);
  } else if (displayName && snap.data().displayName !== displayName) {
    await setDoc(ref, { displayName, updatedAt: now }, { merge: true });
  }
}
