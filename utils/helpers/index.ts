

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

export const calculateAngle = (
  p1: { renderX: number; renderY: number },
  vertex: { renderX: number; renderY: number },
  p2: { renderX: number; renderY: number }
) => {
  const v1 = {
    x: p1.renderX - vertex.renderX,
    y: p1.renderY - vertex.renderY,
  };

  const v2 = {
    x: p2.renderX - vertex.renderX,
    y: p2.renderY - vertex.renderY,
  };

  const dot = v1.x * v2.x + v1.y * v2.y;

  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

  if (!mag1 || !mag2) return null;

  const cosAngle = dot / (mag1 * mag2);

  // Prevent floating-point errors
  const clampedCos = Math.max(
    -1,
    Math.min(1, cosAngle)
  );

  const radians = Math.acos(clampedCos);

  return (radians * 180) / Math.PI;
};

//For angles that have 

export const calculateSignedAngle = (
  p1: { renderX: number; renderY: number },
  vertex: { renderX: number; renderY: number },
  p2: { renderX: number; renderY: number }
) => {
  const v1x = p1.renderX - vertex.renderX;
  const v1y = p1.renderY - vertex.renderY;

  const v2x = p2.renderX - vertex.renderX;
  const v2y = p2.renderY - vertex.renderY;

  const cross =
    v1x * v2y -
    v1y * v2x;

  const dot =
    v1x * v2x +
    v1y * v2y;

  return (
    Math.atan2(cross, dot) *
    (180 / Math.PI)
  );
};



export const calculateDistance = (
  p1: Point,
  p2: Point,
  pixelsPerMm: number
) => {
  const dx = p2.renderX - p1.renderX;
  const dy = p2.renderY - p1.renderY;

  const pixelDistance = Math.hypot(dx, dy);

  return pixelDistance / pixelsPerMm;
};

type Point = {
  renderX: number;
  renderY: number;
};

export const getLineIntersection = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null => {
  const x1 = p1.renderX;
  const y1 = p1.renderY;

  const x2 = p2.renderX;
  const y2 = p2.renderY;

  const x3 = p3.renderX;
  const y3 = p3.renderY;

  const x4 = p4.renderX;
  const y4 = p4.renderY;

  const denominator =
    (x1 - x2) * (y3 - y4) -
    (y1 - y2) * (x3 - x4);

  // Parallel lines
  if (Math.abs(denominator) < 0.000001) {
    return null;
  }

  const t =
    ((x1 - x3) * (y3 - y4) -
      (y1 - y3) * (x3 - x4)) /
    denominator;

  return {
    renderX: x1 + t * (x2 - x1),
    renderY: y1 + t * (y2 - y1),
  };
};

