import { getBlob, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { RadiographRef } from "@/types";
import { newId } from "./ids";
import { radiographPath } from "./paths";

export const ALLOWED_RADIOGRAPH_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
};
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // keep in sync with storage.rules

export function validateRadiograph(file: File): string | null {
  if (!ALLOWED_RADIOGRAPH_TYPES[file.type]) {
    return "Please upload a JPEG or PNG radiograph.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Radiograph must be smaller than 20 MB.";
  }
  return null;
}

/**
 * Reserves the storage path for a new upload so AI runs can reference it
 * before the upload finishes. Each upload gets a new ID: originals are never overwritten.
 */
export function planRadiographUpload(
  uid: string,
  patientId: string,
  studyId: string,
  file: File
): RadiographRef {
  const ext = ALLOWED_RADIOGRAPH_TYPES[file.type] ?? "bin";
  return {
    storagePath: radiographPath(uid, patientId, studyId, newId(), ext),
    contentType: file.type,
    sizeBytes: file.size,
    originalFilename: file.name,
    uploadedAt: new Date().toISOString(),
  };
}

export async function uploadToPath(
  path: string,
  data: Blob,
  contentType: string
): Promise<void> {
  await uploadBytes(ref(storage(), path), data, { contentType });
}

// Object URLs are cached for the session so re-opening a study doesn't re-download it.
const urlCache = new Map<string, Promise<string>>();

/**
 * Loads a private file through the SDK (respects storage.rules) and returns a
 * blob: URL. Deliberately avoids getDownloadURL, whose tokens bypass the rules.
 */
export function getPrivateFileUrl(path: string): Promise<string> {
  let cached = urlCache.get(path);
  if (!cached) {
    cached = getBlob(ref(storage(), path)).then((blob) =>
      URL.createObjectURL(blob)
    );
    cached.catch(() => urlCache.delete(path));
    urlCache.set(path, cached);
  }
  return cached;
}
