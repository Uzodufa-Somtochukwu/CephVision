

import { CephStudy, PatientInfo } from "@/types";

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createEmptyPatient(patientID:string): PatientInfo {
  return {
    name: "",
    id:  `${patientID.length >= 1 ? patientID : `PT-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 9999)
    ).padStart(4, "0")}`}`,
    age: "",
    sex: "",
    date: new Date().toLocaleDateString(),
    doctorName: "",
  };
}

export function createEmptyStudy(selectedPatientId:string = ''): CephStudy {
  const now = new Date().toISOString();

  return {
    id: createId(),

    patient: createEmptyPatient(selectedPatientId),

    imageSrc: null,

    imageDimensions: {
      width: 800,
      height: 800,
    },

    landmarks: [],

    analysisData: null,

    editableFindings: {
      skeletal: "",
      dental: "",
      isConfirmed: false,
    },

    selectedMalocclusion: "Class II",

    customObjectives: [],

    clinicianNotes: "",

    createdAt: now,
    updatedAt: now,
  };
}