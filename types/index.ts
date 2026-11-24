export type AnalysisMode =
  | "steiner"
  | "mcnamara"
  | "jarabak"
  | "tweed"
  | "wits"
  | "soft-tissue"
  | "comprehensive";

 export type AnalysisSelection = {
  hardTissue: boolean;
  softTissue: boolean;
  modes: AnalysisMode[];
  measurements: string[];
};

export type LandmarkCategory = "hard-tissue" | "soft-tissue";

export interface LandmarkDefinition {
  id: string;
  labels: string[];
  abbreviation: string;
  name: string;
  category: LandmarkCategory;
  description?: string;
  requiredFor?: AnalysisMode[];
  renderX?:number;
  renderY?:number;
  x?:number;
  y?:number;
  class?:string;
  confidence?:number
};
export interface Keypoint {
  id?: string;
  class: string;
  x: number;
  y: number;
  confidence?: number;
  renderX?: number;
  renderY?: number;
}

export interface PredictionObject {
  keypoints?: Keypoint[];
  [key: string]: any;
}

export interface CephMeasurement {
  id: string;
  name: string;
  fullName: string;
  value: number | string;
  unit: string;
  norm: string;
  normMin: number;
  normMax: number;
  category: 'skeletal' | 'dental' | 'vertical';
  interpretation: string;
  status: 'normal' | 'low' | 'high' | 'pending';
}

export interface TreatmentPlanOption {
  type: 'braces' | 'aligners';
  title: string;
  description: string;
  duration: string;
  phases: {
    stage: string;
    title: string;
    description: string;
    details?: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  advantages: string[];
}

export interface CephAnalysisResult {
  landmarks: PredictionObject[];
  measurements: {
    SNA: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    SNB: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    ANB: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    Wits: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    FMA: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    IMPA: { value: number; norm: string; interpretation: string; status: 'normal' | 'low' | 'high' };
    [key: string]: any;
  };
  aiFindings: {
    skeletal: string;
    dental: string;
    softTissue?: string;
    growthPattern?: string;
  };
  malocclusion: {
    classification: 'Class I' | 'Class II' | 'Class III' | 'Class II Div 1' | 'Class II Div 2';
    subtype?: string;
    summary: string;
    skeletalPattern: string;
    dentalPattern: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
  };
  treatmentObjectives: string[];
  treatmentPlans: {
    braces: TreatmentPlanOption;
    aligners: TreatmentPlanOption;
  };
  patientSummary?: string;
}

export interface PatientInfo {
  name: string;
  /** Clinic-facing patient number (e.g. PT-2026-0042). Editable; not the database ID. */
  id: string;
  age: string;
  sex: string;
  /** Analysis date for the study this patient view belongs to. */
  date: string;
  /** Read-only: filled from the study's clinician (the signed-in user's profile). */
  doctorName?: string;
}

export type EditableFindings = {
  skeletal: string;
  dental: string;
  isConfirmed: boolean;
};

/** Pointer to an uploaded radiograph in Cloud Storage. */
export interface RadiographRef {
  storagePath: string;
  contentType: string;
  sizeBytes: number;
  originalFilename: string;
  uploadedAt: string;
}

export interface ClinicianRef {
  uid: string;
  name: string;
}

export type CephStudy = {
  id: string;
  /** Firestore document ID of the patient (users/{uid}/patients/{patientId}). */
  patientId: string;

  /** Joined from the patient document for display/editing; saved back to it. */
  patient: PatientInfo;

  /** UI-only image URL (data: or blob:). Never persisted. */
  imageSrc: string | null;

  radiograph: RadiographRef | null;

  clinician: ClinicianRef | null;

  imageDimensions: {
    width: number;
    height: number;
  };

  landmarks: PredictionObject[];

  analysisData: CephAnalysisResult | null;

  editableFindings: EditableFindings;

  selectedMalocclusion: string;

  customObjectives: string[];

  clinicianNotes: string;

  /** IDs of the immutable AI runs the current landmarks/analysis started from. */
  latestDetectionRunId: string | null;
  latestAnalysisRunId: string | null;

  /** 0 = never saved. Incremented on every save/delete; earlier versions live in /versions. */
  version: number;

  createdAt: string;
  updatedAt: string;
};

/* ---------- Firestore documents ---------- */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRecord {
  ownerUid: string;
  patientNumber: string;
  name: string;
  age: string;
  sex: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StudyRecord = Omit<CephStudy, "patient" | "imageSrc" | "id"> & {
  ownerUid: string;
  analysisDate: string;
  deleted: boolean;
  deletedAt: string | null;
};

export type AiRunType = "landmark-detection" | "ai-analysis";

export interface AiRunRecord {
  type: AiRunType;
  provider: "roboflow" | "gemini";
  model: string;
  radiographPath: string | null;
  imageDimensions: { width: number; height: number };
  /** Normalised output exactly as returned to the app. */
  output: unknown;
  /** Provider's raw response, JSON-encoded (may contain shapes Firestore can't store). */
  rawJson: string | null;
  actorUid: string;
}

export interface ReportRecord {
  storagePath: string;
  fileName: string;
  sizeBytes: number;
  studyVersion: number;
  actorUid: string;
}

export type AuditAction =
  | "study.created"
  | "study.updated"
  | "study.deleted"
  | "patient.created"
  | "patient.updated"
  | "radiograph.uploaded"
  | "ai.run"
  | "report.generated"
  | "local.imported";

export type ViewMode = "patients" | "analysis";

export type AnalysisTab =
  | "radiograph"
  | "measurements"
  | "findings"
  | "treatment";
