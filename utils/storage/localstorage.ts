import { STORAGE_KEY } from "@/config/constants/api-defaults";
import { CephStudy } from "@/types";

export function loadStudies(): CephStudy[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load CephVision studies:", error);
    return [];
  }
}

export function saveStudies(studies: CephStudy[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studies));
  } catch (error) {
    console.error("Failed to save CephVision studies:", error);
  }
}