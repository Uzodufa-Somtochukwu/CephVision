import { Keypoint, CephMeasurement, CephAnalysisResult } from '@/types';
import { useMemo } from 'react';
import { getLineIntersection } from './helpers';
import { Point } from './cephMath';
import { useAppContext } from '@/providers/context-provider';

/**
 * Calculate angle in degrees between three points (vertex is p2)
 * Angle formed by (p1 - p2 - p3)
 */
export function calculateAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Calculate angle between two lines: line 1 (p1->p2) and line 2 (p3->p4)
 */
export function calculateLineAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
): number {
  const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const angle2 = Math.atan2(p4.y - p3.y, p4.x - p3.x);
  let diff = Math.abs(angle1 - angle2) * (180 / Math.PI);
  // if (diff > 90) {
  //   diff = 180 - diff;
  // }
  return diff;
}

/**
 * Extract named landmark from keypoints array with multiple alias fallbacks
 */
export function findLandmark(
  keypoints: Keypoint[],
  labels: string[]
): Keypoint | undefined {
  return keypoints.find((kp) =>
    labels.some((l) => kp.class?.toLowerCase().trim() === l.toLowerCase().trim())
  );
}

/**
 * Compute real-time cephalometric values from placed keypoints
 */
export const ComputeCephComponents = () => {
     const { getAngle } = useAppContext()
  const computeCephFromKeypoints =  function computeVal(keypoints: Keypoint[]): Partial<CephAnalysisResult['measurements']> {


   const sella = findLandmark(keypoints,["sella", "s"]);
  const nasion = findLandmark(keypoints,["nasion", "n"]);
  const ans = findLandmark(keypoints,["ans"]);
  const pns = findLandmark(keypoints,["pns"]);
  const aPoint = findLandmark(keypoints,["subspinale", "a_point", "a"]);
  const bPoint = findLandmark(keypoints,["supramentale", "b_point", "b"]);
  const menton = findLandmark(keypoints,["mention", "me"]);
  const gonion = findLandmark(keypoints,["gonion", "go"]);
  const articulare = findLandmark(keypoints,["articulae","articule","articulare", "ar"]);
  const xgonion = findLandmark(keypoints,["xgonion"]);
  const porion = findLandmark(keypoints,["ponion", "po"]);
  const orbitale = findLandmark(keypoints,["orbitale", "or"]);
  const subnasale = findLandmark(keypoints,["subnasale"]);
  const upperLip = findLandmark(keypoints,["upper-lip", "upper_lip", "ls"]);
  const lowerLip = findLandmark(keypoints,["lower-lip", "lower_lip", "li"]);
  const softPog = findLandmark(keypoints,["soft-tissue-pogonion", "soft_pogonion", "pog_prime"]);
  // new points to add to models
  const softNas = findLandmark(keypoints,["soft-tissue-nasion", "soft_nasion", "sn"]);
  const noseTip = findLandmark(keypoints,["nose-tip", "nose-tip", "n-t"]);
  const glabella = findLandmark(keypoints,["glabella", "glabella", "g-l"]);
  const ntToSubnaleIntersection = findLandmark(keypoints,['nose-tip-subnasale-intersection'])
    
  const u1Tip = findLandmark(keypoints,[
    "upper-incisor-tip",
    "upper_incisor_tip",
    "u1_tip",
    "is",
  ]);

  const u1Apex = findLandmark(keypoints,[
    "upper-incisor-apex",
    "upper_incisor_apex",
    "u1_apex",
    "ia",
  ]);

  const l1Tip = findLandmark(keypoints,[
    "lower-incisor-tip",
    "lower_incisor_tip",
    "l1_tip",
    "ii",
  ]);

  const l1Apex = findLandmark(keypoints,[
    "lower-incisor-apex",
    "lower_incisor_apex",
    "l1_apex",
    "ia",
  ]);
  
  // const sella = findLandmark(keypoints, ['sella', 's']);
  // const nasion = findLandmark(keypoints, ['nasion', 'n']);
  // const aPoint = findLandmark(keypoints, ['subspinale', 'a_point', 'a']);
  // const bPoint = findLandmark(keypoints, ['supramentale', 'b_point', 'b']);
  // const menton = findLandmark(keypoints, ['menton', 'me']);
  // const gonion = findLandmark(keypoints, ['gonion', 'go']);
  // const porion = findLandmark(keypoints, ['ponion', 'po']);
  // const orbitale = findLandmark(keypoints, ['orbitale', 'or']);
  // const lowerIncTip = findLandmark(keypoints, ['lower-incisor-tip', 'lower_incisor_tip', 'l1_tip', 'is']);
  // const lowerIncApex = findLandmark(keypoints, ['lower-incisor-apex', 'lower_incisor_apex', 'l1_apex', 'ia']);

  const measurements: any = {};
 
  console.log('chjj',l1Apex,l1Tip)
  // SNA: S - N - A
  if (sella && nasion && aPoint) {
    // const snaVal = Number(calculateAngle(sella, nasion, aPoint).toFixed(1));
    const snaVal = getAngle('SNA')?.value || 0
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Normal maxillary position';
    if (snaVal > 84) {
      status = 'high';
      interp = 'Maxillary prognathism / protrusion';
    } else if (snaVal < 80) {
      status = 'low';
      interp = 'Maxillary retrognathism / retrusion';
    }
    measurements.SNA = {
      value: snaVal,
      norm: '82° (± 2°)',
      interpretation: interp,
      status,
    };
  }

  // SNB: S - N - B
  if (sella && nasion && bPoint) {
    const snbVal = Number(calculateAngle(sella, nasion, bPoint).toFixed(1));
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Normal mandibular position';
    if (snbVal > 82) {
      status = 'high';
      interp = 'Mandibular prognathism';
    } else if (snbVal < 78) {
      status = 'low';
      interp = 'Mandibular retrognathism';
    }
    measurements.SNB = {
      value: snbVal,
      norm: '80° (± 2°)',
      interpretation: interp,
      status,
    };
  }

  // ANB: A - N - B or SNA - SNB
  if (measurements.SNA && measurements.SNB) {
    const anbVal = Number((measurements.SNA.value - measurements.SNB.value).toFixed(1));
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Skeletal Class I relationship';
    if (anbVal > 4) {
      status = 'high';
      interp = 'Skeletal Class II jaw discrepancy';
    } else if (anbVal < 0) {
      status = 'low';
      interp = 'Skeletal Class III jaw discrepancy';
    }
    measurements.ANB = {
      value: anbVal,
      norm: '2° (± 2°)',
      interpretation: interp,
      status,
    };
  }

  // FMA: Frankfort Mandibular Plane Angle (Po-Or to Go-Me) or SN-GoMe
  if (gonion && menton) {
    let fmaVal = 25.0;
    if (porion && orbitale) {
      fmaVal = Number(calculateLineAngle(porion, orbitale, gonion, menton).toFixed(1));
    }
    // } else if (sella && nasion) {
    //   // SN-GoMe is typically ~32° (norm 32°±3°); converted approx Tweed FMA = SN-GoMe - 7°
    //   const snGoMe = calculateLineAngle(sella, nasion, gonion, menton);
    //   fmaVal = Number(Math.max(14, Math.min(42, snGoMe - 7)).toFixed(1));
    // }
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Normodivergent facial growth';
    if (fmaVal > 28) {
      status = 'high';
      interp = 'Hyperdivergent / High angle (long face)';
    } else if (fmaVal < 22) {
      status = 'low';
      interp = 'Hypodivergent / Low angle (short face, deep bite risk)';
    }
    measurements.FMA = {
      value: fmaVal,
      norm: '25° (± 3°)',
      interpretation: interp,
      status,
    };
  }

  // IMPA: Incisor Mandibular Plane Angle (L1 axis to Go-Me) //somemight not work if the keypoints were not returned
  if (gonion && menton && l1Tip && l1Apex) {
    
    
    const l1Angle = calculateLineAngle(l1Apex, l1Tip, gonion, menton);
    console.log('line-angle', l1Angle)
    // const impaVal = Number((180 - l1Angle > 120 ? 180 - l1Angle : l1Angle).toFixed(1));
    const impaVal = Number((180 - l1Angle).toFixed(1))
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Normal lower incisor inclination';
    if (impaVal > 95) {
      status = 'high';
      interp = 'Proclined lower incisors';
    } else if (impaVal < 86) {
      status = 'low';
      interp = 'Retroclined lower incisors';
    }
    measurements.IMPA = {
      value: impaVal,
      norm: '90° (± 4°)',
      interpretation: interp,
      status,
    };
  }

  // Wits Appraisal (sagittal relation projection)
  if (measurements.ANB) {
    // Linear approximation based on ANB for visual feedback
    const witsVal = Number(((measurements.ANB.value - 2) * 1.1).toFixed(1));
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Class I skeletal harmony';
    if (witsVal > 1.5) {
      status = 'high';
      interp = 'Class II skeletal discrepancy (Wits > +1mm)';
    } else if (witsVal < -2.0) {
      status = 'low';
      interp = 'Class III skeletal discrepancy (Wits < -2mm)';
    }
    measurements.Wits = {
      value: `${witsVal > 0 ? '+' : ''}${witsVal} mm`,
      norm: '0 mm (♂ -1mm, ♀ 0mm)',
      interpretation: interp,
      status,
    };
  }

  // IIA: Interincisal Angle (L1 axis to U1 axis) //somemight not work if the keypoints were not returned
  if (u1Apex && u1Tip && l1Tip && l1Apex) {
    
    
    const l1Angle = calculateLineAngle(l1Apex, l1Tip, u1Tip, u1Apex);
    console.log('line-angle', l1Angle)
    // const impaVal = Number((180 - l1Angle > 120 ? 180 - l1Angle : l1Angle).toFixed(1));
    const impaVal = Number((180-l1Angle).toFixed(1))
    let status: 'normal' | 'low' | 'high' = 'normal';
    let interp = 'Normal lower incisor inclination';
    if (impaVal > 95) {
      status = 'high';
      interp = 'Proclined lower incisors';
    } else if (impaVal < 86) {
      status = 'low';
      interp = 'Retroclined lower incisors';
    }
    measurements.IIA = {
      value: impaVal,
      norm: '90° (± 4°)',
      interpretation: interp,
      status,
    };
  }

  return measurements;
}

return {computeCephFromKeypoints}
}

