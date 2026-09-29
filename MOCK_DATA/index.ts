import { AnalysisMode, CephAnalysisResult, LandmarkDefinition } from "@/types";


export const mockCephAnalysisResult: CephAnalysisResult = {
  landmarks: [],

  measurements: {
    SNA: {
      value: 80,
      norm: "82 ± 2°",
      interpretation: "Maxillary position is within the normal range.",
      status: "normal",
    },

    SNB: {
      value: 84,
      norm: "80 ± 2°",
      interpretation: "Mandibular position is increased relative to the cranial base, suggesting mandibular prognathism.",
      status: "high",
    },

    ANB: {
      value: -4,
      norm: "2 ± 2°",
      interpretation: "Negative ANB indicates a skeletal Class III relationship.",
      status: "low",
    },

    Wits: {
      value: -5,
      norm: "0 ± 2 mm",
      interpretation: "Negative Wits appraisal supports a skeletal Class III anteroposterior relationship.",
      status: "low",
    },

    FMA: {
      value: 24,
      norm: "25 ± 5°",
      interpretation: "Mandibular plane angle is within the normal range, suggesting an average vertical growth pattern.",
      status: "normal",
    },

    IMPA: {
      value: 82,
      norm: "90 ± 5°",
      interpretation: "Lower incisors are retroclined relative to the mandibular plane, consistent with dental compensation of the skeletal Class III relationship.",
      status: "low",
    },

     IIA: {
      value: 82,
      norm: "90 ± 5°",
      interpretation: "Lower incisors are retroclined relative to the mandibular plane, consistent with dental compensation of the skeletal Class III relationship.",
      status: "low",
    },
  },

  aiFindings: {
    skeletal:
      "The cephalometric measurements demonstrate a skeletal Class III pattern characterized primarily by increased mandibular prominence. SNA is within normal limits while SNB is increased, resulting in a negative ANB and negative Wits appraisal. This suggests that mandibular prognathism is a greater contributor to the sagittal skeletal discrepancy than maxillary deficiency.",

    dental:
      "The lower incisors demonstrate relative retroclination, suggesting dental compensation for the underlying skeletal Class III discrepancy. The upper incisors should be assessed for compensatory proclination and the presence of an anterior crossbite should be correlated clinically.",

    softTissue:
      "The soft-tissue profile may demonstrate increased lower facial prominence and a relatively concave facial profile associated with the underlying skeletal Class III relationship. Soft-tissue findings should be correlated with clinical examination and facial photographs.",

    growthPattern:
      "The FMA is within the normal range, suggesting an average vertical growth pattern. The sagittal skeletal discrepancy appears to be the predominant cephalometric abnormality.",
  },

  malocclusion: {
    classification: "Class III",

    subtype: "Skeletal Class III predominantly associated with mandibular prognathism",

    summary:
      "The cephalometric findings are consistent with a skeletal Class III malocclusion, characterized by an increased SNB, negative ANB, and negative Wits appraisal. The maxillary position is approximately normal, while mandibular prominence appears to contribute substantially to the sagittal discrepancy.",

    skeletalPattern:
      "Skeletal Class III pattern with a relatively prominent mandible and normal-to-mildly retrusive maxillary position.",

    dentalPattern:
      "Dental compensation is suggested by retroclination of the mandibular incisors. Clinical examination is required to determine the extent of anterior crossbite and the relationship of the upper incisors.",

    severity: "Moderate",
  },

  treatmentObjectives: [
    "Correct the anterior-posterior skeletal and dental discrepancy.",
    "Establish a functional and stable overjet and overbite.",
    "Correct anterior crossbite if clinically present.",
    "Improve incisor inclination while maintaining periodontal health.",
    "Coordinate the upper and lower dental arches.",
    "Improve facial and soft-tissue balance where orthodontically achievable.",
    "Establish functional occlusion with appropriate canine and molar relationships.",
    "Maintain long-term stability following active treatment.",
  ],

  treatmentPlans: {
    braces: {
      title: "Comprehensive Fixed Orthodontic Treatment",
      description:
        "Fixed orthodontic appliances with comprehensive arch coordination and controlled incisor positioning. Treatment mechanics should account for the underlying skeletal Class III relationship and the existing dental compensation.",
      duration: "18–24 months",
      
    } as any,

    aligners: {
      title: "Comprehensive Clear Aligner Treatment",
      description:
        "Clear aligners may be considered for selected cases where the skeletal discrepancy is within the range that can be managed orthodontically. Treatment requires careful control of incisor movement and assessment of aligner predictability.",
      duration: "18–30 months",
      
    } as any,
  },

  patientSummary:
    "The cephalometric analysis demonstrates a moderate skeletal Class III relationship. The primary sagittal finding is increased mandibular prominence, with the maxilla positioned approximately within normal limits. The negative ANB and Wits values support the skeletal Class III diagnosis, while the reduced IMPA suggests compensatory retroclination of the mandibular incisors. The vertical skeletal pattern is approximately average based on the FMA. Treatment planning should be based on the patient's age, growth status, clinical examination, facial profile, occlusion, periodontal condition, and severity of the skeletal discrepancy.",
};

export const ANALYSIS_MODES: {
  id: AnalysisMode;
  name: string;
  description: string;
}[] = [
  {
    id: "steiner",
    name: "Steiner",
    description: "Sagittal skeletal and dental relationships",
  },
  {
    id: "mcnamara",
    name: "McNamara",
    description: "Skeletal, airway and vertical analysis",
  },
  {
    id: "jarabak",
    name: "Jarabak",
    description: "Growth pattern and facial height relationships",
  },
  {
    id: "tweed",
    name: "Tweed",
    description: "Lower incisor and mandibular plane analysis",
  },
  {
    id: "wits",
    name: "Wits",
    description: "Sagittal jaw relationship",
  },
  {
    id: "soft-tissue",
    name: "Soft Tissue",
    description: "Facial profile and soft-tissue relationships",
  },
  {
    id: "comprehensive",
    name: "Comprehensive",
    description: "Combined cephalometric analysis",
  },
];

export const CEPH_LANDMARKS_KEYPOINTS: LandmarkDefinition[] = [
  // ============ ====== = ======
  // HARD TISSUE
  // =========================
  //The index of the object here should match the index in the keypoints returned

  {
    id: "nasion",
    labels: ["nasion", "n"],
    abbreviation: "N",
    name: "Nasion",
    category: "hard-tissue",
    requiredFor: ["steiner", "mcnamara", "jarabak", "comprehensive"],
  },
  {
    id: "sella",
    labels: ["sella", "s"],
    abbreviation: "S",
    name: "Sella",
    category: "hard-tissue",
    requiredFor: ["steiner", "jarabak", "comprehensive"],
  },

  
  {
    id: "orbitale",
    labels: ["orbitale", "or"],
    abbreviation: "Or",
    name: "Orbitale",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "comprehensive"],
  },

  {
    id: "ans",
    labels: ["ans", "anterior nasal spine"],
    abbreviation: "ANS",
    name: "Anterior Nasal Spine",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "jarabak", "comprehensive"],
  },
  {
    id: "subnasale",
    labels: ["subnasale", "sn"],
    abbreviation: "Sn",
    name: "Subnasale",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
  //soft tissue
  {
    id: "a-point",
    labels: ["a", "a-point", "a_point","a-point", "subspinale"],
    abbreviation: "A",
    name: "A Point / Subspinale",
    category: "hard-tissue",
    requiredFor: ["steiner", "mcnamara", "wits", "comprehensive"],
  },
  

  {
    id: "b-point",
    labels: ["b", "b-point", "b_point",'b-point', "supramentale"],
    abbreviation: "B",
    name: "B Point / Supramentale",
    category: "hard-tissue",
    requiredFor: ["steiner", "mcnamara", "wits", "comprehensive"],
  },

  {
    id: "pogonion",
    labels: ["pogonion", "pog", "pog'"],
    abbreviation: "Pog",
    name: "Pogonion",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "comprehensive"],
  },

  {
    id: "mention",
    labels: ["menton", "me"],
    abbreviation: "Me",
    name: "Menton",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "jarabak", "tweed", "comprehensive"],
  },

  {
    id: "gonion",
    labels: ["gonion", "go"],
    abbreviation: "Go",
    name: "Gonion",
    category: "hard-tissue",
    requiredFor: ["jarabak", "tweed", "comprehensive"],
  },

  {
    id: "porion",
    labels: ["porion", "po","ponion"],
    abbreviation: "Po",
    name: "Porion",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "comprehensive"],
  },

  {
    id: "pns",
    labels: ["pns", "posterior nasal spine"],
    abbreviation: "PNS",
    name: "Posterior Nasal Spine",
    category: "hard-tissue",
    requiredFor: ["mcnamara", "jarabak", "comprehensive"],
  },

  {
    id: "articulae",
    labels: ["articulare", "art", "ar", 'articulae'],
    abbreviation: "Ar",
    name: "Articulare",
    category: "hard-tissue",
    requiredFor: ["jarabak", "comprehensive"],
  },

  // =========================
  // INCISORS
  // =========================

  {
    id: "upper-incisor",
    labels: [
      "upper-incisor",
      "upper_incisor_tip",
      "u1_tip",
      "is",
    ],
    abbreviation: "U1",
    name: "Upper Incisor Incisal Tip",
    category: "hard-tissue",
    requiredFor: ["steiner", "tweed", "comprehensive"],
  },

  {
    id: "incisor-apex",
    labels: [
      "incisor-apex",
      "upper-incisor-apex",
      "upper_incisor_apex",
      "u1_apex",
      "uia",
    ],
    abbreviation: "U1A",
    name: "Upper Incisor Apex",
    category: "hard-tissue",
    requiredFor: ["steiner", "tweed", "comprehensive"],
  },

  {
    id: "lower-incisor",
    labels: [
      "lower-incisor",
      "lower_incisor_tip",
      "l1_tip",
      "ii",
    ],
    abbreviation: "L1T",
    name: "Lower Incisor Incisal Tip",
    category: "hard-tissue",
    requiredFor: ["steiner", "tweed", "comprehensive"],
  },

  {
    id: "lower-incisor-apex",
    labels: [
      "lower-incisor-apex",
      "lower_incisor_apex",
      "l1_apex",
      "ia",
    ],
    abbreviation: "L1A",
    name: "Lower Incisor Apex",
    category: "hard-tissue",
    requiredFor: ["steiner", "tweed", "comprehensive"],
  },

  // =========================
  // SOFT TISSUE
  // =========================

  {
    id: "soft-tissue-nasion",
    labels: ["soft-nasion", "soft_nasion", "n-prime", "n'"],
    abbreviation: "N′",
    name: "Soft Tissue Nasion",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
    renderX: 100,
      renderY: 70,
      class: "soft-tissue-nasion",
      x: 100,
      y: 70,
      confidence: 0.9,
  },

  

  {
    id: "Upper-Lip",
    labels: ["upper-lip", "upper_lip", "ls"],
    abbreviation: "Ls",
    name: "Labrale Superius",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
   {
    id: "nose-tip",
    labels: ["nose-tip", "nose-tip", "n-t"],
    abbreviation: "NT",
    name: "Nose Tip",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
  {
    id: "Lower-Lip",
    labels: ["lower-lip", "lower_lip", "li"],
    abbreviation: "Li",
    name: "Labrale Inferius",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },

  {
    id: "soft-tissue-pogonion",
    labels: [
      "soft-tissue-pogonion",
      "soft_pogonion",
      "pog_prime",
      "pog'",
    ],
    abbreviation: "Pog′",
    name: "Soft Tissue Pogonion",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
{
    id: "glabella",
    labels: [
      "glabella",
      "glabella"
    ],
    abbreviation: "G′",
    name: "Glabella",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
  {
    id: "soft-menton",
    labels: ["soft-menton", "soft_menton", "me-prime", "me'"],
    abbreviation: "Me′",
    name: "Soft Tissue Menton",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  },
  {
    id: "s-intersection",
    labels: ["nose-tip-subnasale-intersection", "s-intersection"],
    abbreviation: "NT-I",
    name: "nose-tip-subnasale-intersection",
    category: "soft-tissue",
    requiredFor: ["soft-tissue", "comprehensive"],
  }
];

export const ANALYSIS_LANDMARKS_FOR_ANALYSISMODES: Record<string, string[]> = {
  steiner: [
    "sella",
    "nasion",
    "subspinale",
    "supramentale",
    "gonion",
    "menton",
    "porion",
    "orbitale",
    "ans",
    "pns",
    "upper-incisor-tip",
    "lower-incisor-tip",
    "lower-incisor-apex",
    "subnasale",
    "upper-lip",
    "lower-lip",
    "soft-tissue-pogonion",
  ],

  jarabak: [
    "sella",
    "nasion",
    "gonion",
    "menton",
    "articulare",
  ],

  mcnamara: [
    "nasion",
    "aPoint",
    "pogonion",
    "menton",
    "gonion",
    "ans",
    "pns",
    "upper-incisor-tip",
    "lower-incisor-tip",
  ],

  tweed: [
    "gonion",
    "menton",
    "porion",
    "orbitale",
    "lower-incisor-tip",
    "lower-incisor-apex",
  ],
};

export const CEPH_ANALYSES = {
  steiner: {
    name: "Steiner",
    landmarks: [
      "sella",
      "nasion",
      "aPoint",
      "supramentale",
      "gonion",
      "menton",
      "ponion",
      "orbitale",
      "ans",
      "pns",
      "upper-incisor-tip",
      "lower-incisor-tip",
      "lower-incisor-apex",
    ],
    measurements: [
      "SNA",
      "SNB",
      "ANB",
      "U1-SN",
      "U1-NA-angle",
      "U1-NA-linear",
      "L1-NB-angle",
      "L1-NB-linear",
    ],
  },

  jarabak: {
    name: "Jarabak",
    landmarks: [
      "sella",
      "nasion",
      "articulae",
      "gonion",
      "menton",
    ],
    measurements: [
      "N-ANS",
      "ANS-Me",
      "ANS-Me_N-Me",
      "Jarabak ratio",
    ],
  },

  mcnamara: {
    name: "McNamara",
    landmarks: [
      "nasion",
      "aPoint",
      "pogonion",
      "ans",
      "pns",
      "gonion",
      "menton",
    ],
    measurements: [
      "Co-A",
      "Co-Gn",
      "N-Perp-to-A",
      "N-Perp-to-Pog",
    ],
  },
} as const;

export const CEPH_ANALYSIS_CONFIG:Record<string,Record<string, string[]>> = {
  steiner: { 
    landmarks: [
      "sella",
      "nasion",
      "subspinale",
      "a-point",
      "b-point",
      "supramentale",
      "gonion",
      "mention",
      "porion",
      "orbitale",
      "pogonion",
      "gnathion",
      "ans",
      "pns",
      "u1Tip",
      "l1Tip",
     
      // "subnasale",
      // "Upper-Lip",
      // "Lower-Lip",
      // "soft-tissue-pogonion",
      "lower-incisor-apex",
      "lower-incisor",
      "upper-incisor",
      "incisor-apex"
    ],

    tracings: [
      "SN",
      "PO",
      "NA",
      "NB",
      "GO-ME",
      "PNS-ANS",
      "L1_AXIS",
      "l1Apex-l1Tip",
      "u1Apex-u1Tip",
      "U1-SN"
    ],
  },

   "soft-tissue": { 
    landmarks: [
      "subnasale",
      "Upper-Lip",
      "Lower-Lip",
      "soft-tissue-pogonion",
      "soft-tissue-nasion",
      "nose-tip",
      "ponion",
      "glabella",
      "orbitale",
      "s-intersection"
    ],

    tracings: [ 
      "SOFT_TISSUE",
      "NT-SPO",
      "GL-NT",
      "SOFTNAS-SOFTPOG",
      "SOFTPOG-LLIP",
      "SOFTPOG-ULIP",
      "PO",
      "SubN-NT"
    ],
  },

  jarabak: {
    landmarks: [
      "sella",
      "nasion",
      "articulae",
      "gonion",
      "mention",
    ],

    tracings: [
      "SN",
      "SGo",
      "NMe",
      "ART-GO",
      "GO-ME",
      "S-ART",
      "N-GO",
    ],
  },
  tweed:{
    landmarks:[
      'ponion',
      'orbitale',
      'gonion',
      'mention',
      'lower-incisor-tip',
      'lower-incisor-apex'
    ],
    tracings: [
      'PO',
      'GO-ME',
      'l1Apex-l1Tip'
    ]
  },
  comprehensive: {
    landmarks:[
      "sella",
      "nasion",
      "a-point",
      "b-point",
      "gonion",
      "mention",
      "ponion",
      "orbitale",
      "pogonion",
      "articulae",
      "gnathion",
      "ans",
      "pns",
      "u1Tip",
      "l1Tip",
      "l1Apex",
      "subnasale",
      "Upper-Lip",
      "Lower-Lip",
      "soft-tissue-pogonion",
      "lower-incisor-apex",
      "lower-incisor",
      "upper-incisor",
      "upper-incisor-apex",
      "subnasale",
      "Upper-Lip",
      "Lower-Lip",
      "soft-tissue-pogonion",
      "soft-tissue-nasion",
      "nose-tip",
      "ponion",
      "glabella",
      "orbitale",
      "s-intersection"
    ],
    tracings:[
      "NA",
      "NB",
      "GO-ME",
      "PNS-ANS",
      "L1_AXIS",
      "SOFT_TISSUE",
      "l1Apex-l1Tip",
      "u1Apex-u1Tip",
      "U1-SN",
        "SOFT_TISSUE",
      "NT-SPO",
      "GL-NT",
      "SOFTNAS-SOFTPOG",
      "SOFTPOG-LLIP",
      "SOFTPOG-ULIP",
      "PO",
      "SubN-NT",
        "SN",
      "SGo",
      "NMe",
      "ART-GO",
      "GO-ME",
      "S-ART",
      "N-GO",
    ]
  },

  mcnamara: {
    landmarks: [
      "nasion",
      "subspinale",
      "pogonion",
      "ponion",
      "orbitale",
      "ans",
      "pns",
      "gonion",
      "mention",
      "u1Tip",
      "l1Tip",
    ],

    tracings: [
      "PO",
      "NA",
      "NB",
      "PNS-ANS",
      "GO-ME",
    ],
  },
} 



