import { AnalysisMode, LandmarkDefinition } from "@/types";

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
    id: "Subspinale",
    labels: ["a", "a point", "a_point", "subspinale"],
    abbreviation: "A",
    name: "A Point / Subspinale",
    category: "hard-tissue",
    requiredFor: ["steiner", "mcnamara", "wits", "comprehensive"],
  },

  {
    id: "supramentale",
    labels: ["b", "b point", "b_point", "supramentale"],
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
    id: "ponion",
    labels: ["porion", "po"],
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
    id: "upper-incisor-tip",
    labels: [
      "upper-incisor-tip",
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
    id: "upper-incisor-apex",
    labels: [
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
    id: "lower-incisor-tip",
    labels: [
      "lower-incisor-tip",
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
      "supramentale",
      "gonion",
      "mention",
      "ponion",
      "orbitale",
      "pogonion",
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
      "lower-incisor-tip",
      "upper-incisor-tip",
      "upper-incisor-apex"
    ],

    tracings: [
      "SN",
      "PO",
      "NA",
      "NB",
      "GO-ME",
      "PNS-ANS",
      "L1_AXIS",
      "SOFT_TISSUE",
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
      "orbitale"
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