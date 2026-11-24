import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Firebase web config. These values are public identifiers, not secrets;
 * access is enforced by firestore.rules and storage.rules.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firestore: Firestore | null = null;

export function firebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables in .env.local."
    );
  }

  return initializeApp(firebaseConfig);
}

export function firebaseAuth(): Auth {
  return getAuth(firebaseApp());
}

export function db(): Firestore {
  if (firestore) return firestore;

  try {
    // Firestore rejects `undefined` field values by default; several
    // optional fields in CephStudy can be undefined.
    firestore = initializeFirestore(firebaseApp(), {
      ignoreUndefinedProperties: true,
    });
  } catch {
    // Already initialised (e.g. after a hot reload).
    firestore = getFirestore(firebaseApp());
  }

  return firestore;
}

export function storage(): FirebaseStorage {
  return getStorage(firebaseApp());
}
