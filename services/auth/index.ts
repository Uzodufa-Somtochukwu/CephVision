import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "@/config/firebase";
import { ensureUserProfile } from "@/services/data/users";
import { SignInI, SignUpI } from "@/types/auth";

export async function signIn({ email, password }: SignInI) {
  const { user } = await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
  await ensureUserProfile(user);
  return user;
}

export async function signUp({ username, email, password }: SignUpI) {
  const { user } = await createUserWithEmailAndPassword(
    firebaseAuth(),
    email.trim(),
    password
  );
  await updateProfile(user, { displayName: username.trim() });
  await ensureUserProfile(user, username.trim());
  return user;
}

export function signOut() {
  return firebaseSignOut(firebaseAuth());
}

export function authErrorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return err instanceof Error ? err.message : "Something went wrong.";
  }
}
