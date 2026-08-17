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
  id: string;
  age: string;
  sex: string;
  date: string;
  doctorName?: string;
}
