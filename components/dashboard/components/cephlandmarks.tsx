// import { ANALYSIS_LANDMARKS_FOR_ANALYSISMODES, CEPH_LANDMARKS_KEYPOINTS } from "@/MOCK_DATA";
// import { AnalysisSelection, Keypoint, PredictionObject } from "@/types";
// import { useEffect, useState } from "react";

// export function CephLandmarks({
//   landmarks = [],
//   onLandmarkChange,
//   imageDimensions,
//   showPlanes = true,
//   showLabels = true,
//   analysisSelection
// }: {
//   landmarks: PredictionObject[];
//   onLandmarkChange?: (updated: PredictionObject[]) => void;
//   imageDimensions: {
//     width: number;
//     height: number;
//   };
//   showPlanes?: boolean;
//   showLabels?: boolean;
//   analysisSelection: AnalysisSelection;
// }) {
//   const [activeDragIndex, setActiveDragIndex] = useState<number | string | null>(null);

//   const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>(
//   CEPH_LANDMARKS_KEYPOINTS
//     .filter((lm) => lm.category === "hard-tissue")
//     .map((lm) => lm.id)
// )

// const toggleLandmark = (id: string) => {
//   setSelectedLandmarks((prev) =>
//     prev.includes(id)
//       ? prev.filter((item) => item !== id)
//       : [...prev, id]
//   );
// };

// const getLandmarksForAnalyses = (modes: string[]) => {
//   const landmarkIds = modes.flatMap(
//     (mode) => ANALYSIS_LANDMARKS_FOR_ANALYSISMODES[mode] ?? []
//   );

//   return [...new Set(landmarkIds)];
// };

// useEffect(() => {
//   const selectedIds = getLandmarksForAnalyses(
//     analysisSelection.modes
//   );

//   setSelectedLandmarks(selectedIds);
// }, [analysisSelection.modes]);

//   const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

//   const extraKeypoints = rawKeypoints.map((kp) => ({
//     ...kp,
//     renderX: kp.x,
//     renderY: kp.y,
//   }));


  
 
//   const keypointsList = [
//     ...extraKeypoints,
//     {
//       renderX: -10,
//       renderY: -10,
//       id: "ccee",
//       class: "xgonion",
//       x: -10,
//       y: -10,
//       confidence: 90,
//     },
//   ];
//   const modifiedKeypointList = CEPH_LANDMARKS_KEYPOINTS.map((item) => {
//     const n = keypointsList.find(keys=> keys.class.toLowerCase().trim() === item.id.toLowerCase().trim() )
//     return {...item, x:n?.x, y:n?.y,renderX:n?.renderX,renderY:n?.renderY,class:n?.class,confidence:n?.confidence}
//   })

//   const getLM = (possibleLabels: string[], maxRelativeY?: number) => {
//     const matches = keypointsList.filter((lm) =>
//       possibleLabels.some(
//         (label) =>
//           lm.class?.toLowerCase().trim() === label.toLowerCase().trim(),
//       ),
//     );

//     if (matches.length === 0) return undefined;

//     if (maxRelativeY !== undefined) {
//       const upperMatches = matches.filter((m) => m.renderY <= maxRelativeY);

//       if (upperMatches.length > 0) {
//         return upperMatches.reduce((prev, curr) =>
//           curr.renderY < prev.renderY ? curr : prev,
//         );
//       }
//     }

//     return matches.reduce((prev, curr) =>
//       (curr.confidence || 0) > (prev.confidence || 0) ? curr : prev,
//     );
//   };

//   const sella = getLM(["sella", "s"], 450);
//   const nasion = getLM(["nasion", "n"], 350);
//   const ans = getLM(["ans"]);
//   const pns = getLM(["pns"]);
//   const aPoint = getLM(["subspinale", "a_point", "a"]);
//   const bPoint = getLM(["supramentale", "b_point", "b"]);
//   const menton = getLM(["mention", "me"]);
//   const gonion = getLM(["gonion", "go"]);
//   const xgonion = getLM(["xgonion"]);
//   const porion = getLM(["ponion", "po"]);
//   const orbitale = getLM(["orbitale", "or"]);
//   const subnasale = getLM(["subnasale"]);
//   const upperLip = getLM(["upper-lip", "upper_lip", "ls"]);
//   const lowerLip = getLM(["lower-lip", "lower_lip", "li"]);
//   const softPog = getLM(["soft-tissue-pogonion", "soft_pogonion", "pog_prime"]);

//   const u1Tip = getLM([
//     "upper-incisor-tip",
//     "upper_incisor_tip",
//     "u1_tip",
//     "is",
//   ]);

//   const l1Tip = getLM([
//     "lower-incisor-tip",
//     "lower_incisor_tip",
//     "l1_tip",
//     "ii",
//   ]);

//   const l1Apex = getLM([
//     "lower-incisor-apex",
//     "lower_incisor_apex",
//     "l1_apex",
//     "ia",
//   ]);

//   const handleMouseDown = (index: number | string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setActiveDragIndex(index);
//   };

//   const svgPointFromMouse = (
//   svg: SVGSVGElement,
//   clientX: number,
//   clientY: number
// ) => {
//   const rect = svg.getBoundingClientRect();

//   const scale = Math.min(
//     rect.width / imageDimensions.width,
//     rect.height / imageDimensions.height
//   );

//   const renderedWidth = imageDimensions.width * scale;
//   const renderedHeight = imageDimensions.height * scale;

//   const offsetX = (rect.width - renderedWidth) / 2;
//   const offsetY = (rect.height - renderedHeight) / 2;

//   return {
//     x: (clientX - rect.left - offsetX) / scale,
//     y: (clientY - rect.top - offsetY) / scale,
//   };
// };

//   const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
//     if (activeDragIndex === null || !onLandmarkChange) {
//       return;
//     }
//     const point = svgPointFromMouse(
//     e.currentTarget,
//     e.clientX,
//     e.clientY
//   );
//     const rect = e.currentTarget.getBoundingClientRect();

//     const newRenderX =
//       ((e.clientX - rect.left) / rect.width) * imageDimensions.width;

//     const newRenderY =
//       ((e.clientY - rect.top) / rect.height) * imageDimensions.height;

//     // const updatedKeypoints = [...rawKeypoints];
//     const updatedKeypoints = rawKeypoints.map(item => item.class === activeDragIndex ? {... item, 
//       x: Math.round(point.x),
//       y: Math.round(point.y)} : item)

//     onLandmarkChange([
//       {
//         ...landmarks[0],
//         keypoints: updatedKeypoints,
//       },
//     ]);
//   };

//   const handleMouseUp = () => {
//     setActiveDragIndex(null);
//   };

//   return (
//     <svg
//       viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
//       className="absolute inset-0 z-20 h-full w-full cursor-crosshair select-none"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {showPlanes && (
//         <g className="pointer-events-none">
//           {analysisSelection.hardTissue && sella && nasion && (
//             <line
//               x1={sella.renderX}
//               y1={sella.renderY}
//               x2={nasion.renderX}
//               y2={nasion.renderY}
//               stroke="#ef4444"
//               strokeWidth={2}
//               strokeDasharray="5 3"
//             />
//           )}

//           {analysisSelection.hardTissue && porion &&
//             orbitale &&
//             (() => {
//               const dx = porion.renderX - orbitale.renderX;
//               const dy = porion.renderY - orbitale.renderY;

//               // How far beyond pns you want the line to extend
//               const extension = 750;
//               const extensionA = -150;

//               // Normalize the direction vector
//               const length = Math.sqrt(dx * dx + dy * dy);

//               const unitX = dx / length;
//               const unitY = dy / length;

//               // New endpoint beyond Gonion
//               const extendedX = porion.renderX + unitX * extension;
//               const extendedY = porion.renderY + unitY * extension;

//               // New endpoint beyond Orbitale
//               const extendedOX = orbitale.renderX + unitX * extensionA;
//               const extendedOY = orbitale.renderY + unitY * extensionA;

//               return (
//                 <line
//                   x1={extendedOX}
//                   y1={extendedOY}
//                   x2={extendedX}
//                   y2={extendedY}
//                   stroke="#8b5cf6"
//                   strokeWidth={1.5}
//                   strokeDasharray="4 2"
//                 />
//               );
//             })()}

//           {analysisSelection.hardTissue &&  nasion && aPoint && (
//             <line
//               x1={nasion.renderX}
//               y1={nasion.renderY}
//               x2={aPoint.renderX}
//               y2={aPoint.renderY}
//               stroke="#22c55e"
//               strokeWidth={1.5}
//             />
//           )}

//           {analysisSelection.hardTissue && nasion && bPoint && (
//             <line
//               x1={nasion.renderX}
//               y1={nasion.renderY}
//               x2={bPoint.renderX}
//               y2={bPoint.renderY}
//               stroke="#16a34a"
//               strokeWidth={1.5}
//             />
//           )}

//           {analysisSelection.hardTissue && gonion &&
//             menton &&
//             (() => {
//               const dx = gonion.renderX - menton.renderX;
//               const dy = gonion.renderY - menton.renderY;

//               // How far beyond Gonion you want the line to extend
//               const extension = 550;

//               // Normalize the direction vector
//               const length = Math.sqrt(dx * dx + dy * dy);

//               const unitX = dx / length;
//               const unitY = dy / length;

//               // New endpoint beyond Gonion
//               const extendedX = gonion.renderX + unitX * extension;
//               const extendedY = gonion.renderY + unitY * extension;

//               return (
//                 <line
//                   x1={menton.renderX}
//                   y1={menton.renderY}
//                   x2={extendedX}
//                   y2={extendedY}
//                   stroke="#22c55e"
//                   strokeWidth={2}
//                 />
//               );
//             })()}

//           {analysisSelection.hardTissue &&  ans &&
//             pns &&
//             (() => {
//               const dx = pns.renderX - ans.renderX;
//               const dy = pns.renderY - ans.renderY;

//               // How far beyond pns you want the line to extend
//               const extension = 750;

//               // Normalize the direction vector
//               const length = Math.sqrt(dx * dx + dy * dy);

//               const unitX = dx / length;
//               const unitY = dy / length;

//               // New endpoint beyond Gonion
//               const extendedX = pns.renderX + unitX * extension;
//               const extendedY = pns.renderY + unitY * extension;

//               return (
//                 <line
//                   x1={ans.renderX}
//                   y1={ans.renderY}
//                   x2={extendedX}
//                   y2={extendedY}
//                   stroke="#eab308"
//                   strokeWidth={1.5}
//                   strokeDasharray="3 3"
//                 />
//               );
//             })()}

//           {analysisSelection.hardTissue &&  l1Apex && l1Tip && (
//             <line
//               x1={l1Apex.renderX}
//               y1={l1Apex.renderY}
//               x2={l1Tip.renderX}
//               y2={l1Tip.renderY}
//               stroke="#ec4899"
//               strokeWidth={1.5}
//             />
//           )}

//           {analysisSelection.softTissue && subnasale && upperLip && lowerLip && softPog && (
//             <path
//               d={`M ${subnasale.renderX} ${subnasale.renderY}
//                 Q ${upperLip.renderX} ${upperLip.renderY},
//                 ${lowerLip.renderX} ${lowerLip.renderY}
//                 T ${softPog.renderX} ${softPog.renderY}`}
//               fill="none"
//               stroke="#22c55e"
//               strokeWidth={2}
//               strokeDasharray="4 3"
//             />
//           )}
//         </g>
//       )}

//       {analysisSelection.hardTissue && modifiedKeypointList.filter(item => item.category === 'hard-tissue' && selectedLandmarks.includes(item.id)).map((lm, idx) => (
//         <g
//           key={`${lm.class}-${idx}`}
//           transform={`translate(${lm.renderX}, ${lm.renderY})`}
//           onMouseDown={(e) => handleMouseDown(lm?.class as string, e)}
//           className="group cursor-grab active:cursor-grabbing"
//         >
//           <circle
//             r={8}
//             fill="#22c55e"
//             fillOpacity={0.35}
//             stroke="#22c55e"
//             strokeWidth={1.5}
//             className="transition-all duration-150 group-hover:scale-150"
//           />

//           <circle r={2.5} fill="#ffffff" />

//           {showLabels && (
//             <text
//               x={10}
//               y={-7}
//               fill="#ffffff"
//               fontSize={10}
//               fontWeight="600"
//               className="pointer-events-none"
//               style={{
//                 paintOrder: "stroke",
//                 stroke: "#000000",
//                 strokeWidth: 3,
//               }}
//             >
//               {lm.abbreviation}
//             </text>
//           )}
//         </g>
//       ))}

//        {analysisSelection.softTissue && modifiedKeypointList.filter(item => item.category === 'soft-tissue' &&  selectedLandmarks.includes(item.id)).map((lm, idx) => (
//         <g
//           key={`${lm.class}-${idx}`}
//           transform={`translate(${lm.renderX}, ${lm.renderY})`}
//           onMouseDown={(e) => handleMouseDown(lm?.class as string, e)}
//           className="group cursor-grab active:cursor-grabbing"
//         >
//           <circle
//             r={8}
//             fill="#22c55e"
//             fillOpacity={0.35}
//             stroke="#22c55e"
//             strokeWidth={1.5}
//             className="transition-all duration-150 group-hover:scale-150"
//           />

//           <circle r={2.5} fill="#ffffff" />

//           {showLabels && (
//             <text
//               x={10}
//               y={-7}
//               fill="#ffffff"
//               fontSize={10}
//               fontWeight="600"
//               className="pointer-events-none"
//               style={{
//                 paintOrder: "stroke",
//                 stroke: "#000000",
//                 strokeWidth: 3,
//               }}
//             >
//               {lm.abbreviation}
//             </text>
//           )}
//         </g>
//       ))}
//     </svg>
//   );
// }

import { ANALYSIS_LANDMARKS_FOR_ANALYSISMODES, CEPH_ANALYSIS_CONFIG, CEPH_LANDMARKS_KEYPOINTS } from "@/MOCK_DATA";
import { AnalysisSelection, Keypoint, PredictionObject } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { AngleAnnotation, Point } from "./svg-angle";
import { getLineIntersection } from "@/utils/helpers";
import { LinearMeasurement } from "./linear-measurement";
import { VerticalLinearMeasurement } from "./vertical-linear-measurement";
import { HorizontalLinearMeasurement } from "./horizontal-lineaar-measurement";

export function CephLandmarks({
  landmarks = [],
  onLandmarkChange,
  imageDimensions,
  showPlanes = true,
  showLabels = true,
  analysisSelection
}: {
  landmarks: PredictionObject[];
  onLandmarkChange?: (updated: PredictionObject[]) => void;
  imageDimensions: {
    width: number;
    height: number;
  };
  showPlanes?: boolean;
  showLabels?: boolean;
  analysisSelection: AnalysisSelection;
}) {
  const [activeDragIndex, setActiveDragIndex] = useState<number | string | null>(null);

  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>(
  CEPH_LANDMARKS_KEYPOINTS
    .filter((lm) => lm.category === "hard-tissue")
    .map((lm) => lm.id)
)
const [selectedTracing, setSelectedTracing] = useState<string[]>([])

const toggleLandmark = (id: string) => {
  setSelectedLandmarks((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};

const getLandmarksForAnalyses = (modes: string[]) => {
  const landmarkIds = modes.flatMap(
    (mode) => CEPH_ANALYSIS_CONFIG[mode]?.landmarks ?? []
  );

  return [...new Set(landmarkIds)];
};

const getTracingForAnalyses = (modes: string[]) => {
  const tracings = modes.flatMap(
    (mode) => CEPH_ANALYSIS_CONFIG[mode]?.tracings ?? []
  );

  return [...new Set(tracings)];
};

useEffect(() => {
  const selectedIds = getLandmarksForAnalyses(
    analysisSelection.modes
  );
   const selectedTracing = getTracingForAnalyses(
    analysisSelection.modes
  );

  setSelectedLandmarks(selectedIds);
  setSelectedTracing(selectedTracing);
}, [analysisSelection.modes]);



  const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

  

  const extraKeypoints = rawKeypoints.map((kp) => ({
    ...kp,
    renderX: kp.x,
    renderY: kp.y,
  }));


  
 
  const keypointsList = [
    ...extraKeypoints,
    {
      renderX: -10,
      renderY: -10,
      id: "ccee",
      class: "xgonion",
      x: -10,
      y: -10,
      confidence: 90,
    },
   
   
    
  
    
   
  ];

  console.log('keypoinssss',keypointsList)
  const modifiedKeypointList = CEPH_LANDMARKS_KEYPOINTS.map((item) => {
    const n = keypointsList.find(keys=> keys.class.toLowerCase().trim() === item.id.toLowerCase().trim() )
    return {...item, x:n?.x, y:n?.y,renderX:n?.renderX,renderY:n?.renderY,class:n?.class,confidence:n?.confidence}
  })

  const getLM = (possibleLabels: string[], maxRelativeY?: number) => {
    const matches = keypointsList.filter((lm) =>
      possibleLabels.some(
        (label) =>
          lm.class?.toLowerCase().trim() === label.toLowerCase().trim(),
      ),
    );

    if (matches.length === 0) return undefined;

    if (maxRelativeY !== undefined) {
      const upperMatches = matches.filter((m) => m.renderY <= maxRelativeY);

      if (upperMatches.length > 0) {
        return upperMatches.reduce((prev, curr) =>
          curr.renderY < prev.renderY ? curr : prev,
        );
      }
    }

    return matches.reduce((prev, curr) =>
      (curr.confidence || 0) > (prev.confidence || 0) ? curr : prev,
    );
  };

  const sella = getLM(["sella", "s"], 450);
  const nasion = getLM(["nasion", "n"], 350);
  const ans = getLM(["ans"]);
  const pns = getLM(["pns"]);
  const aPoint = getLM(["subspinale", "a_point", "a","a-point"]);
  const bPoint = getLM(["supramentale", "b_point","b-point", "b"]);
  const menton = getLM(["mention", "me"]);
  const gonion = getLM(["gonion", "go"]);
  const articulare = getLM(["articulae","articule","articulare", "ar"]);
  const xgonion = getLM(["xgonion"]);
  const porion = getLM(["porion","ponion"]);
  const orbitale = getLM(["orbitale", "or"]);
  const subnasale = getLM(["subnasale"]);
  const upperLip = getLM(["upper-lip", "upper_lip", "ls"]);
  const lowerLip = getLM(["lower-lip", "lower_lip", "li"]);
  const softPog = getLM(["soft-tissue-pogonion", "soft_pogonion", "pog_prime"]);
  // new points to add to models
  const softNas = getLM(["soft-tissue-nasion", "soft_nasion", "sn"]);
  const noseTip = getLM(["nose-tip", "nose-tip", "n-t"]);
  const glabella = getLM(["glabella", "glabella", "g-l"]);
  const ntToSubnaleIntersection = getLM(['nose-tip-subnasale-intersection', 's-intersection'])
  
  const u1Tip = getLM([
    "upper-incisor",
    "upper_incisor_tip",
    "u1_tip",
    "is",
  ]);

  const u1Apex = getLM([
    "incisor-apex",
    "upper_incisor_apex",
    "u1_apex",
    "ia",
  ]);

  const l1Tip = getLM([
    "lower-incisor",
    "lower_incisor_tip",
    "l1_tip",
    "ii",
  ]);

  const l1Apex = getLM([
    "lower-incisor-apex",
    "Lower-Incisor-Apex",
    "lower_incisor_apex",
    "l1_apex",
    "ia",
  ]);

  const handleMouseDown = (index: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragIndex(index);
  };

  const svgPointFromMouse = (
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
) => {
  const rect = svg.getBoundingClientRect();

  const scale = Math.min(
    rect.width / imageDimensions.width,
    rect.height / imageDimensions.height
  );

  const renderedWidth = imageDimensions.width * scale;
  const renderedHeight = imageDimensions.height * scale;

  const offsetX = (rect.width - renderedWidth) / 2;
  const offsetY = (rect.height - renderedHeight) / 2;

  return {
    x: (clientX - rect.left - offsetX) / scale,
    y: (clientY - rect.top - offsetY) / scale,
  };
};

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeDragIndex === null || !onLandmarkChange) {
      return;
    }
    const point = svgPointFromMouse(
    e.currentTarget,
    e.clientX,
    e.clientY
  );
    const rect = e.currentTarget.getBoundingClientRect();

    const newRenderX =
      ((e.clientX - rect.left) / rect.width) * imageDimensions.width;

    const newRenderY =
      ((e.clientY - rect.top) / rect.height) * imageDimensions.height;

    // const updatedKeypoints = [...rawKeypoints];
    const updatedKeypoints = keypointsList.map(item => item.class === activeDragIndex ? {... item, 
      x: Math.round(point.x),
      y: Math.round(point.y)} : item)

    onLandmarkChange([
      {
        ...landmarks[0],
        keypoints: updatedKeypoints,
      },
    ]);
  };

  const handleMouseUp = () => {
    setActiveDragIndex(null);
  };

  const mandibularPlaneIntersection = useMemo(() => {
  if (!ans || !pns || !gonion || !menton) {
    return null;
  }

  return getLineIntersection(
    ans,
    pns,
    gonion,
    menton
  );
}, [
  ans,
  pns,
  gonion,
  menton,
]);

 const FrankfurtPlaneIntersection = useMemo(() => {
  if (!porion || !orbitale || !gonion || !menton) {
    return null;
  }

  return getLineIntersection(
    porion,
    orbitale,
    gonion,
    menton
  );
}, [
  porion,
  orbitale,
  gonion,
  menton,
]);

const softNasSoftPogPlaneIntersection = useMemo(() => {
  if (!porion || !orbitale || !softNas || !softPog) {
    return null;
  }

  return getLineIntersection(
    porion,
    orbitale,
    softNas,
    softPog
  );
}, [
  porion,
  orbitale,
  softNas,
  softPog,
]);

const zAngleIntersection = useMemo(() => {
  if (!porion || !orbitale || !softPog || !lowerLip) {
    return null;
  }

  return getLineIntersection(
    porion,
    orbitale,
    lowerLip,
    softPog
  );
}, [
  porion,
  orbitale,
  lowerLip,
  softPog,
]);

//to help calculate the total facial angle
const totalFacialAngleIntersection = useMemo(() => {
  if (!porion || !orbitale || !softPog || !noseTip) {
    return null;
  }

  return getLineIntersection(
    porion,
    orbitale,
    noseTip,
    softPog
  );
}, [
  porion,
  orbitale,
  noseTip,
  softPog,
]);


//to help calculate the upper incisor to SN angle
const u1SNAngleIntersection = useMemo(() => {
  if (!sella|| !nasion || !u1Apex || !u1Tip) {
    return null;
  }

  return getLineIntersection(
    sella,
    nasion,
    u1Apex,
    u1Tip
  );
}, [
  sella,
  nasion,
  u1Apex,
  u1Tip,
]);

//to help calculate the IMPA angle
const IMPAAngleIntersection = useMemo(() => {
  if (!gonion || !menton || !l1Apex || !l1Tip) {
    return null;
  }

  return getLineIntersection(
    gonion,
    menton,
    l1Tip,
    l1Apex
  );
}, [
  gonion,
  menton,
  l1Tip,
  l1Apex,
]);

//to help calculate the IFPA angle
const IFPAAngleIntersection = useMemo(() => {
  if (!porion || !orbitale || !u1Apex || !u1Tip) {
    return null;
  }

  return getLineIntersection(
    porion,
    orbitale,
    u1Tip,
    u1Apex
  );
}, [
  porion,
  orbitale,
  u1Tip,
  u1Apex,
]);

//to help calculate the Interincisal angle
const InterIncisalAngleIntersection = useMemo(() => {
  if (!l1Apex || !l1Tip || !u1Apex || !u1Tip) {
    return null;
  }

  return getLineIntersection(
    u1Apex,
    u1Tip,
    l1Tip,
    l1Apex
  );
}, [
  u1Apex,
  u1Tip,
  l1Tip,
  l1Apex,
]);

//to help calculate the Upper lip - Eline
const upperLipElineIntersection = useMemo(() => {
  if (!l1Apex || !l1Tip || !u1Apex || !u1Tip) {
    return null;
  }

  return getLineIntersection(
    u1Apex,
    u1Tip,
    l1Tip,
    l1Apex
  );
}, [
  u1Apex,
  u1Tip,
  l1Tip,
  l1Apex,
]);

  return (
    <svg
      viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
      className="absolute inset-0 z-20 h-full w-full cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* angles */}
      {selectedTracing.includes('SN') && selectedTracing.includes('NA') && sella && nasion && aPoint && (
        <AngleAnnotation
          p1={sella}
          vertex={nasion}
          p2={aPoint}
          label="SNA"
        />
      )}
      {selectedTracing.includes('SN') && selectedTracing.includes('NB') && sella && nasion && bPoint && (
        <AngleAnnotation
          p1={sella}
          vertex={nasion}
          p2={bPoint}
          label="SNB"
          labelOffsetX={20}
          labelOffsetY={20}
        />
      )}

      {selectedTracing.includes('SN') && selectedTracing.includes('NB') && sella && aPoint && nasion && bPoint && (
        <AngleAnnotation
          p1={sella}
          vertex={nasion}
          p2={aPoint}
          p3={bPoint}
          label="ANB"
          calculation="anb"
          labelOffsetX={40}
          labelOffsetY={40}
        />
      )}

{/* jarabak angles */}
      {selectedTracing.includes('SN') && selectedTracing.includes('S-ART') && sella && nasion && articulare && (
        <AngleAnnotation
          p1={nasion}
          vertex={sella}
          p2={articulare}
          label="Saddle"
          calculation="standard"
          labelOffsetX={10}
          labelOffsetY={10}
        />
      )}

       {selectedTracing.includes('S-ART') && selectedTracing.includes('ART-GO') && sella && articulare && gonion && (
        <AngleAnnotation
          p1={sella}
          vertex={articulare}
          p2={gonion}
          label="Articular"
          calculation="standard"
          labelOffsetX={10}
          labelOffsetY={10}
        />
      )}
      
      {selectedTracing.includes('ART-GO') && selectedTracing.includes('GO-ME') && articulare && gonion && menton && (
        <AngleAnnotation
          p1={articulare}
          vertex={gonion}
          p2={menton}
          label="Gonial"
          calculation="standard"
          labelOffsetX={30}
          labelOffsetY={30}
        />
      )}

      {selectedTracing.includes('ART-GO') && selectedTracing.includes('N-GO') && articulare && gonion && nasion && (
        <AngleAnnotation
          p1={articulare}
          vertex={gonion}
          p2={nasion}
          label="Upper_Gonial"
          calculation="standard"
          labelOffsetX={-30}
          labelOffsetY={-30}
        />
      )}

     
      {selectedTracing.includes('N-GO') && selectedTracing.includes('GO-ME') && nasion && gonion && menton && (
        <AngleAnnotation
          p1={nasion}
          vertex={gonion}
          p2={menton}
          label="Lower_Gonial"
          calculation="standard"
          labelOffsetX={60}
          labelOffsetY={60}
        />
      )}

      { selectedTracing.includes('PNS-ANS') && selectedTracing.includes('GO-ME') && pns && gonion && menton && (
        <AngleAnnotation
          p1={pns}
          vertex={mandibularPlaneIntersection as Point}
          p2={gonion}
          label="MMPA"
          calculation="standard"
          labelOffsetX={10}
          labelOffsetY={60}
        />
      )}

       { selectedTracing.includes('PO') && selectedTracing.includes('GO-ME') && porion && gonion && menton && (
        <AngleAnnotation
          p1={porion}
          vertex={FrankfurtPlaneIntersection as Point}
          p2={gonion}
          label="FMA"
          calculation="standard"
          labelOffsetX={400}
          labelOffsetY={60}
        />
      )}
      
      {/* orbitale - soft tissue pogonion */}
      { selectedTracing.includes('SOFTNAS-SOFTPOG') && selectedTracing.includes('PO') && orbitale && softPog && (
        <AngleAnnotation
          p1={orbitale}
          vertex={softNasSoftPogPlaneIntersection as Point}
          p2={softPog}
          label="STFA"
          calculation="standard"
          labelOffsetX={10}
          labelOffsetY={20}
        />
      )}
  {/* z-angle, can be from the soft pogonion to upper or lower lips depending on the most protrusive one */}
      { selectedTracing.includes('SOFTPOG-LLIP') && selectedTracing.includes('PO') && orbitale && lowerLip && (
        <AngleAnnotation
          p1={orbitale}
          vertex={zAngleIntersection as Point}
          p2={lowerLip}
          label="Z_Angle"
          calculation="standard"
          labelOffsetX={70}
          labelOffsetY={-40}
        />
      )}

    {/* total facial angle */}
      { selectedTracing.includes('NT-SPO') && selectedTracing.includes('PO') && glabella && noseTip && (
        <AngleAnnotation
          p1={glabella}
          vertex={noseTip as Point}
          p2={totalFacialAngleIntersection as Point}
          label="TFA"
          calculation="standard"
          labelOffsetX={10}
          labelOffsetY={80}
        />
      )}

          {/* Holdaway angle */}
      { selectedTracing.includes('SOFTPOG-ULIP') && selectedTracing.includes('SOFTNAS-SOFTPOG') && glabella && noseTip && (
        <AngleAnnotation
          p1={softNas as Point}
          vertex={softPog as Point}
          p2={upperLip as Point}
          label="H_Angle"
          calculation="standard"
          labelOffsetX={70}
          labelOffsetY={50}
        />
      )}

        {/* Nasolabial angle */}
      { selectedTracing.includes('SOFT_TISSUE') && selectedTracing.includes('SubN-NT')  && subnasale && upperLip && noseTip && (
        <AngleAnnotation
          p1={noseTip as Point}
          vertex={subnasale as Point}
          p2={upperLip as Point}
          label="NLA"
          calculation="standard"
          labelOffsetX={20}
          labelOffsetY={30}
        />
      )}

        {/* U1-SN angle */}
      { selectedTracing.includes('U1-SN') && selectedTracing.includes("SN") && u1Tip && u1Apex && (
        <AngleAnnotation
          p1={u1Apex as Point}
          vertex={u1SNAngleIntersection as Point}
          p2={sella as Point}
          label="U1_SN"
          calculation="standard"
          labelOffsetX={20}
          labelOffsetY={30}
        />
      )}

        {/* IMPA angle */}
      { selectedTracing.includes('l1Apex-l1Tip') && selectedTracing.includes("GO-ME") && l1Apex && gonion && (
        <AngleAnnotation
          p1={l1Apex as Point}
          vertex={IMPAAngleIntersection as Point}
          p2={gonion as Point}
          label="IMPA"
          calculation="standard"
          labelOffsetX={20}
          labelOffsetY={30}
        />
      )}

       {/* IFPA angle */}
      { selectedTracing.includes('u1Apex-u1Tip') && selectedTracing.includes("PO") && u1Apex && gonion && (
        <AngleAnnotation
          p1={u1Apex as Point}
          vertex={IFPAAngleIntersection as Point}
          p2={porion as Point}
          label="IFPA"
          calculation="standard"
          labelOffsetX={20}
          labelOffsetY={30}
        />
      )}

       {/* Interincisal angle */}
      { selectedTracing.includes('u1Apex-u1Tip') && selectedTracing.includes("l1Apex-l1Tip") && u1Apex && gonion && (
        <AngleAnnotation
          p1={u1Apex as Point}
          vertex={InterIncisalAngleIntersection as Point}
          p2={l1Apex as Point}
          label="IIncisal"
          calculation="standard"
          labelOffsetX={20}
          labelOffsetY={60}
        />
      )}

      {/* Linear measurement */}

      {/* <VerticalLinearMeasurement
      p1={nasion as Point}
      p2={menton as Point}
      label="N-M"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
    /> */}

//straight line from nasion to menton
{
  analysisSelection.hardTissue && selectedTracing.includes('NMe')  && (
    <VerticalLinearMeasurement
  p1={nasion as Point}
  p2={menton as Point}
  lineEnd={{renderX:menton?.renderX as number + 700, renderY:menton?.renderY} as Point}
  label="AFH"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
   imgDetails={imageDimensions}
   offsetLabel={-45}
/>
  )
}

{
  analysisSelection.hardTissue && selectedTracing.includes('NMe')  && (
    <VerticalLinearMeasurement
  p1={sella as Point}
  p2={gonion as Point}
   label="PFH"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
      offsetLabel={200}
/>
  )
}



{
  analysisSelection.softTissue && selectedTracing.includes("SOFT_TISSUE") && (
  <>

      //straight line from subnasale to menton
<VerticalLinearMeasurement
  p1={subnasale as Point}
  p2={menton as Point}
  lineEnd={{renderX:menton?.renderX as number + 700, renderY:menton?.renderY} as Point}
  label="LFH"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
   imgDetails={imageDimensions}
   offsetLabel={-150}
/>

//lowerlip to Eline 
      <HorizontalLinearMeasurement
  p1={lowerLip as Point}
  p2={softPog as Point}
  lineEnd={noseTip}
  label="LL-E"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
  offsetLabel={260}
   imgDetails={imageDimensions}
/>

//upperlip to Eline 
      <HorizontalLinearMeasurement
  p1={upperLip as Point}
  p2={softPog as Point}
  lineEnd={noseTip}
  label="UL-E"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
  offsetLabel={320}
   imgDetails={imageDimensions}
/>

//upperlip to Sline 
      <HorizontalLinearMeasurement
  p1={upperLip as Point}
  p2={softPog as Point}
  lineEnd={ntToSubnaleIntersection}
  label="UL-S"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
  offsetLabel={390}
  color="#ef4444"
   imgDetails={imageDimensions}
/>

 //lowerlip to Sline 
      <HorizontalLinearMeasurement
  p1={lowerLip as Point}
  p2={softPog as Point}
  lineEnd={ntToSubnaleIntersection}
  label="LL-S"
  pixelsPerMm={0.264583}
  mode="point-to-line"
  showReferenceLine
  color="#ef4444"
  offsetLabel={200}
   imgDetails={imageDimensions}
/>

//  upperlip to upperIncisor 
     <HorizontalLinearMeasurement
      p1={u1Tip as Point}
      p2={upperLip as Point}
      label="UL-U1"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
      offsetLabel={140}
    />

     //lowerlip to upperIncisor 
     <HorizontalLinearMeasurement
      p1={u1Tip as Point}
      p2={lowerLip as Point}
      label="LL-U1"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
      offsetLabel={60}
    />

   //lowerlip to lowerIncisor 
     <HorizontalLinearMeasurement
      p1={l1Tip as Point}
      p2={lowerLip as Point}
      label="LL-L1"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
      offsetLabel={100}
    />

    //upperlip to lowerIncisor 
     <HorizontalLinearMeasurement
      p1={l1Tip as Point}
      p2={upperLip as Point}
      label="UL-L1"
      pixelsPerMm={0.264583}
      imgDetails={imageDimensions}
      offsetLabel={200}
    />
    </>
    )
}



    {/* planes */}
      {showPlanes && (
        <g className="pointer-events-none">
          {analysisSelection.hardTissue && selectedTracing.includes('SN') && sella && nasion && (
            <line
              x1={sella.renderX}
              y1={sella.renderY}
              x2={nasion.renderX}
              y2={nasion.renderY}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('SGo') && sella && gonion && (
            <line
              x1={sella.renderX}
              y1={sella.renderY}
              x2={gonion.renderX}
              y2={gonion.renderY}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('NMe') && nasion && menton && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={menton.renderX}
              y2={menton.renderY}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}

           {analysisSelection.hardTissue && selectedTracing.includes('ART-GO') && articulare && gonion && (
            <line
              x1={articulare.renderX}
              y1={articulare.renderY}
              x2={gonion.renderX}
              y2={gonion.renderY}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}
      

          {analysisSelection.hardTissue && selectedTracing.includes('PO') && porion &&
            orbitale &&
            (() => {
              const dx = porion.renderX - orbitale.renderX;
              const dy = porion.renderY - orbitale.renderY;

              // How far beyond pns you want the line to extend
              const extension = 750;
              const extensionA = -350;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

              // New endpoint beyond ponion
              const extendedX = porion.renderX + unitX * extension;
              const extendedY = porion.renderY + unitY * extension;

              // New endpoint beyond Orbitale
              const extendedOX = orbitale.renderX + unitX * extensionA;
              const extendedOY = orbitale.renderY + unitY * extensionA;

              return (
                <line
                  x1={extendedOX}
                  y1={extendedOY}
                  x2={extendedX}
                  y2={extendedY}
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}

          {analysisSelection.hardTissue && selectedTracing.includes('NA') && nasion && aPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={aPoint.renderX}
              y2={aPoint.renderY}
              stroke="#22c55e"
              strokeWidth={1.5}
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('S-ART') && sella && articulare && (
            <line
              x1={sella.renderX}
              y1={sella.renderY}
              x2={articulare.renderX}
              y2={articulare.renderY}
              stroke="#22c55e"
              strokeWidth={1.5}
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('N-GO') && nasion && gonion && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={gonion.renderX}
              y2={gonion.renderY}
              stroke="#22c55e"
              strokeWidth={1.5}
              
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('NB') &&  nasion && bPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={bPoint.renderX}
              y2={bPoint.renderY}
              stroke="#16a34a"
              strokeWidth={1.5}
            />
          )}

          {analysisSelection.hardTissue && selectedTracing.includes('GO-ME') && gonion &&
            menton &&
            (() => {
              const dx = gonion.renderX - menton.renderX;
              const dy = gonion.renderY - menton.renderY;

              // How far beyond Gonion you want the line to extend
              const extension = 750;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

              // New endpoint beyond Gonion
              const extendedX = gonion.renderX + unitX * extension;
              const extendedY = gonion.renderY + unitY * extension;

              return (
                <line
                  x1={menton.renderX}
                  y1={menton.renderY}
                  x2={extendedX}
                  y2={extendedY}
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              );
            })()}


            {/* //menton extension */}

              {analysisSelection.hardTissue && selectedTracing.includes('GO-ME') && gonion &&
            menton &&
            (() => {
              
              // How far beyond Gonion you want the line to extend
              const extension = 750;

             
              return (
                <line
                  x1={menton.renderX + extension}
                  y1={menton.renderY}
                  x2={menton.renderX - 350}
                  y2={menton.renderY}
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              );
            })()}

          {analysisSelection.hardTissue && selectedTracing.includes('PNS-ANS') &&  ans &&
            pns &&
            (() => {
              const dx = pns.renderX - ans.renderX;
              const dy = pns.renderY - ans.renderY;

              // How far beyond pns you want the line to extend
              const extension = 750;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

              // New endpoint beyond Gonion
              const extendedX = pns.renderX + unitX * extension;
              const extendedY = pns.renderY + unitY * extension;

              return (
                <line
                  x1={ans.renderX}
                  y1={ans.renderY}
                  x2={extendedX}
                  y2={extendedY}
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              );
            })()}

        
           
           {analysisSelection.softTissue && selectedTracing.includes('NT-SPO') &&  softPog && softNas && (
            <line
              x1={softNas.renderX}
              y1={softNas.renderY}
              x2={softPog.renderX}
              y2={softPog.renderY}
              stroke="#ec4899"
              strokeWidth={1.5}
            />
          )}
           {analysisSelection.softTissue && selectedTracing.includes('NT-SPO') &&  softPog && noseTip && (
            <line
              x1={noseTip.renderX}
              y1={noseTip.renderY}
              x2={softPog.renderX}
              y2={softPog.renderY}
              stroke="#ec4899"
              strokeWidth={1.5}
            />
          )}
          {analysisSelection.softTissue && selectedTracing.includes('NT-SPO') &&  softPog && noseTip &&
            (() => {
              const dx = softPog.renderX - noseTip.renderX;
              const dy = softPog.renderY - noseTip.renderY;

              // How far beyond nose you want the line to extend
              const extension = 750;
              const extensionA = -350;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond Orbitale
              const extendedOX = noseTip.renderX + unitX * extensionA;
              const extendedOY = noseTip.renderY + unitY * extensionA;

              return (
                <line
                  x1={softPog.renderX}
                  y1={softPog.renderY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}
          
          {/* pogonion-lowerlip */}
          {analysisSelection.softTissue && selectedTracing.includes('NT-SPO') &&  softPog && lowerLip &&
            (() => {
              const dx = softPog.renderX - lowerLip.renderX;
              const dy = softPog.renderY - lowerLip.renderY;

              // How far beyond nose you want the line to extend
              const extension = 750;
              const extensionA = -450;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond Orbitale
              const extendedOX = lowerLip.renderX + unitX * extensionA;
              const extendedOY = lowerLip.renderY + unitY * extensionA;

              return (
                <line
                  x1={softPog.renderX}
                  y1={softPog.renderY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#ec4899"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}
          
          {/* pogonion-upperlip */}
          {analysisSelection.softTissue && selectedTracing.includes('NT-SPO') &&  softPog && ntToSubnaleIntersection &&
            (() => {
              const dx = softPog.renderX - ntToSubnaleIntersection.renderX;
              const dy = softPog.renderY - ntToSubnaleIntersection.renderY;

              // How far beyond nose you want the line to extend
              const extension = 750;
              const extensionA = -450;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond Orbitale
              const extendedOX = ntToSubnaleIntersection.renderX + unitX * extensionA;
              const extendedOY = ntToSubnaleIntersection.renderY + unitY * extensionA;

              return (
                <line
                  x1={softPog.renderX}
                  y1={softPog.renderY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}

            {/* glabella-nosetip */}
          {analysisSelection.softTissue && selectedTracing.includes('GL-NT') && glabella  && noseTip &&
            (() => {
              const dx = glabella.renderX - noseTip.renderX;
              const dy = glabella.renderY - noseTip.renderY;

              // How far beyond nose you want the line to extend
              const extension = 750;
              const extensionA = -450;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond Orbitale
              const extendedOX = noseTip.renderX + unitX * extensionA;
              const extendedOY = noseTip.renderY + unitY * extensionA;

              return (
                <line
                  x1={glabella.renderX}
                  y1={glabella.renderY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#ec4899"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}
          
          {/* lower incisor apex to lower incisor tip */}
           {analysisSelection.hardTissue && selectedTracing.includes('l1Apex-l1Tip') && l1Apex && l1Tip  &&
            (() => {
              const dx = l1Tip.renderX - l1Apex.renderX;
              const dy = l1Tip.renderY - l1Apex.renderY;

              // How far beyond nose you want the line to extend
              const extension = 750;
              const extensionA = -440;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond lower incisor apex
              const extendedOX = l1Apex.renderX + unitX * extension;
              const extendedOY = l1Apex.renderY + unitY * extension;

               // New endpoint beyond lower incisor tip
              const extendedX = l1Tip.renderX + unitX * extensionA;
              const extendedY = l1Tip.renderY + unitY * extensionA;

              return (
                <line
                  x1={extendedX}
                  y1={extendedY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}

           {/* upper incisor apex to upper incisor tip */}
           {analysisSelection.hardTissue && selectedTracing.includes('u1Apex-u1Tip') && u1Tip && u1Apex &&
              (() => {
              const dx = u1Tip.renderX - u1Apex.renderX;
              const dy = u1Tip.renderY - u1Apex.renderY;

              // How far beyond nose you want the line to extend
              const extension = 350;
              const extensionA = -840;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

            
              // New endpoint beyond lower incisor apex
              const extendedOX = u1Apex.renderX + unitX * extension;
              const extendedOY = u1Apex.renderY + unitY * extension;

               // New endpoint beyond lower incisor tip
              const extendedX = u1Tip.renderX + unitX * extensionA;
              const extendedY = u1Tip.renderY + unitY * extensionA;

              return (
                <line
                  x1={extendedX}
                  y1={extendedY}
                  x2={extendedOX}
                  y2={extendedOY}
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            })()}

         { analysisSelection.softTissue && selectedTracing.includes('SOFT_TISSUE') && noseTip && softNas && subnasale && upperLip && lowerLip && softPog && (
            <path
              d={`M${softNas.renderX} ${softNas.renderY}
                  ${noseTip.renderX} ${noseTip.renderY}
                ${subnasale.renderX} ${subnasale.renderY}
                 Q ${upperLip.renderX} ${upperLip.renderY},
                ${lowerLip.renderX} ${lowerLip.renderY}
                T ${softPog.renderX} ${softPog.renderY}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
          )}
          
        </g>
      )}



      {analysisSelection.hardTissue && modifiedKeypointList.filter(item => item.category === 'hard-tissue' && selectedLandmarks.includes(item?.id?.toLowerCase())).map((lm, idx) => (
        <g
          key={`${lm.class}-${idx}`}
          transform={`translate(${lm.renderX}, ${lm.renderY})`}
          onMouseDown={(e) => handleMouseDown(lm?.class as string, e)}
          className="group cursor-grab active:cursor-grabbing"
        >
          <circle
            r={8}
            fill="#22c55e"
            fillOpacity={0.35}
            stroke="#22c55e"
            strokeWidth={1.5}
            className="transition-all duration-150 group-hover:scale-150"
          />

          <circle r={2.5} fill="#ffffff" />

          {showLabels && (
            <text
              x={10}
              y={-7}
              fill="#ffffff"
              fontSize={10}
              fontWeight="600"
              className="pointer-events-none"
              style={{
                paintOrder: "stroke",
                stroke: "#000000",
                strokeWidth: 3,
              }}
            >
              {lm.abbreviation}
            </text>
          )}
        </g>
      ))}

       {analysisSelection.softTissue && modifiedKeypointList.filter(item => item.category === 'soft-tissue' &&  selectedLandmarks.includes(item.id)).map((lm, idx) => (
        <g
          key={`${lm.class}-${idx}`}
          transform={`translate(${lm.renderX}, ${lm.renderY})`}
          onMouseDown={(e) => handleMouseDown(lm?.class as string, e)}
          className="group cursor-grab active:cursor-grabbing"
        >
          <circle
            r={8}
            fill="#22c55e"
            fillOpacity={0.35}
            stroke="#22c55e"
            strokeWidth={1.5}
            className="transition-all duration-150 group-hover:scale-150"
          />

          <circle r={1} fill="#ffffff" />

          {showLabels && (
            <text
              x={10}
              y={-7}
              fill="#ffffff"
              fontSize={10}
              fontWeight="600"
              className="pointer-events-none"
              style={{
                paintOrder: "stroke",
                stroke: "#000000",
                strokeWidth: 3,
              }}
            >
              {lm.abbreviation}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

