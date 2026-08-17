// "use client";

// import React, { useState, ChangeEvent, useRef } from "react";

// export interface Keypoint {
//   id?: string;
//   class: string;
//   x: number;
//   y: number;
//   confidence?: number;
// }

// export interface PredictionObject {
//   keypoints?: Keypoint[];
//   [key: string]: any;
// }

// /* =========================================================
//    CEPHALOMETRIC LANDMARK OVERLAY
//    Existing detection / dragging logic preserved
// ========================================================= */

// function CephLandmarks({
//   landmarks = [],
//   onLandmarkChange,
//   imageDimensions,
//   showPlanes = true,
// }: {
//   landmarks: PredictionObject[];
//   onLandmarkChange?: (updated: PredictionObject[]) => void;
//   imageDimensions: { width: number; height: number };
//   showPlanes?: boolean;
// }) {
//   const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);

//   const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

//   const scaleX = imageDimensions.width ? 800 / imageDimensions.width : 1;
//   const scaleY = imageDimensions.height ? 800 / imageDimensions.height : 1;

//   const keypointsList = rawKeypoints.map((kp) => ({
//     ...kp,
//     renderX: kp.x,
//     renderY: kp.y,
//   }));

//   const getLM = (possibleLabels: string[], maxRelativeY?: number) => {
//     const matches = keypointsList.filter((lm) =>
//       possibleLabels.some(
//         (label) => lm.class?.toLowerCase() === label.toLowerCase()
//       )
//     );

//     if (matches.length === 0) return undefined;

//     if (maxRelativeY !== undefined) {
//       const upperMatches = matches.filter(
//         (m) => m.renderY <= maxRelativeY
//       );

//       if (upperMatches.length > 0) {
//         return upperMatches.reduce((prev, curr) =>
//           curr.renderY < prev.renderY ? curr : prev
//         );
//       }
//     }

//     return matches.reduce((prev, curr) =>
//       (curr.confidence || 0) > (prev.confidence || 0) ? curr : prev
//     );
//   };

//   const sella = getLM(["sella", "s"], 450);
//   const nasion = getLM(["nasion", "n"], 350);
//   const ans = getLM(["ans"]);
//   const pns = getLM(["pns"]);
//   const aPoint = getLM(["subspinale", "a_point", "a"]);
//   const bPoint = getLM(["supramentale", "b_point", "b"]);
//   const menton = getLM(["menton", "me"]);
//   const pogonion = getLM(["pogonion", "pog"]);
//   const gonion = getLM(["gonion", "go"]);
//   const subnasale = getLM(["subnasale"]);
//   const upperLip = getLM(["upper-lip", "upper_lip"]);
//   const lowerLip = getLM(["lower-lip", "lower_lip"]);
//   const softPog = getLM([
//     "soft-tissue-pogonion",
//     "soft_pogonion",
//   ]);

//   const handleMouseDown = (
//     index: number,
//     e: React.MouseEvent
//   ) => {
//     e.stopPropagation();
//     setActiveDragIndex(index);
//   };

//   const handleMouseMove = (
//     e: React.MouseEvent<SVGSVGElement>
//   ) => {
//     if (activeDragIndex === null || !onLandmarkChange) return;

//     const rect = e.currentTarget.getBoundingClientRect();

//     const newRenderX =
//       ((e.clientX - rect.left) / rect.width) *
//       imageDimensions.width;

//     const newRenderY =
//       ((e.clientY - rect.top) / rect.height) *
//       imageDimensions.height;

//     const originalX = imageDimensions.width
//       ? Math.round(newRenderX / scaleX)
//       : newRenderX;

//     const originalY = imageDimensions.height
//       ? Math.round(newRenderY / scaleY)
//       : newRenderY;

//     const updatedKeypoints = [...rawKeypoints];

//     updatedKeypoints[activeDragIndex] = {
//       ...updatedKeypoints[activeDragIndex],
//       x: Math.round(newRenderX),
//       y: Math.round(newRenderY),
//     };

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
//       className="absolute inset-0 w-full h-full z-20 cursor-crosshair select-none"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {showPlanes && (
//         <g className="pointer-events-none">
//           {/* S-N */}
//           {sella && nasion && (
//             <line
//               x1={sella.renderX}
//               y1={sella.renderY}
//               x2={nasion.renderX}
//               y2={nasion.renderY}
//               stroke="#f43f5e"
//               strokeWidth={2}
//               strokeDasharray="4 3"
//             />
//           )}

//           {/* N-A */}
//           {nasion && aPoint && (
//             <line
//               x1={nasion.renderX}
//               y1={nasion.renderY}
//               x2={aPoint.renderX}
//               y2={aPoint.renderY}
//               stroke="#38bdf8"
//               strokeWidth={1.5}
//             />
//           )}

//           {/* N-B */}
//           {nasion && bPoint && (
//             <line
//               x1={nasion.renderX}
//               y1={nasion.renderY}
//               x2={bPoint.renderX}
//               y2={bPoint.renderY}
//               stroke="#0284c7"
//               strokeWidth={1.5}
//             />
//           )}

//           {/* Mandibular plane */}
//           {gonion && menton && (
//             <line
//               x1={gonion.renderX}
//               y1={gonion.renderY}
//               x2={menton.renderX}
//               y2={menton.renderY}
//               stroke="#10b981"
//               strokeWidth={2}
//             />
//           )}

//           {/* Palatal plane */}
//           {ans && pns && (
//             <line
//               x1={ans.renderX}
//               y1={ans.renderY}
//               x2={pns.renderX}
//               y2={pns.renderY}
//               stroke="#fbbf24"
//               strokeWidth={1.5}
//               strokeDasharray="3 3"
//             />
//           )}

//           {/* Soft tissue contour */}
//           {subnasale &&
//             upperLip &&
//             lowerLip &&
//             softPog && (
//               <path
//                 d={`M ${subnasale.renderX} ${subnasale.renderY}
//                 Q ${upperLip.renderX} ${upperLip.renderY},
//                 ${lowerLip.renderX} ${lowerLip.renderY}
//                 T ${softPog.renderX} ${softPog.renderY}`}
//                 fill="none"
//                 stroke="#38bdf8"
//                 strokeWidth={2}
//                 strokeDasharray="4 3"
//               />
//             )}
//         </g>
//       )}

//       {keypointsList.map((lm, idx) => (
//         <g
//           key={`${lm.class}-${idx}`}
//           transform={`translate(${lm.renderX}, ${lm.renderY})`}
//           onMouseDown={(e) => handleMouseDown(idx, e)}
//           className="cursor-grab active:cursor-grabbing group"
//         >
//           <circle
//             r={6}
//             fill="#38bdf8"
//             fillOpacity={0.4}
//             stroke="#38bdf8"
//             strokeWidth={1.5}
//             className="transition-all duration-150 group-hover:scale-150"
//           />

//           <circle r={2.5} fill="#ffffff" />

//           <text
//             x={8}
//             y={-6}
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight="bold"
//             className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,1)]"
//           >
//             {lm.class}
//           </text>
//         </g>
//       ))}
//     </svg>
//   );
// }

// /* =========================================================
//    SMALL UI COMPONENTS
// ========================================================= */

// function SectionHeader({
//   number,
//   title,
//   description,
// }: {
//   number: string;
//   title: string;
//   description?: string;
// }) {
//   return (
//     <div className="flex items-start gap-4 mb-6">
//       <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-semibold text-sm shrink-0">
//         {number}
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold text-white">
//           {title}
//         </h2>

//         {description && (
//           <p className="text-sm text-slate-500 mt-1">
//             {description}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function Card({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={`bg-slate-900/70 border border-slate-800 rounded-2xl ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// function MeasurementRow({
//   name,
//   value = "—",
//   range,
//   interpretation = "Awaiting analysis",
// }: {
//   name: string;
//   value?: string;
//   range: string;
//   interpretation?: string;
// }) {
//   return (
//     <div className="grid grid-cols-[1.2fr_0.7fr_1fr_1.5fr] items-center gap-4 py-4 border-b border-slate-800 last:border-0">
//       <div className="font-medium text-slate-200">
//         {name}
//       </div>

//       <div className="text-white font-semibold">
//         {value}
//       </div>

//       <div className="text-xs text-slate-500">
//         {range}
//       </div>

//       <div className="text-sm text-slate-400">
//         {interpretation}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN PAGE
// ========================================================= */

// export default function Home() {
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [landmarks, setLandmarks] = useState<
//     PredictionObject[]
//   >([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const [imgDims, setImgDims] = useState<{
//     width: number;
//     height: number;
//   }>({
//     width: 800,
//     height: 800,
//   });

//   const imageRef = useRef<HTMLImageElement>(null);

//   const handleImageUpload = (
//     e: ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setError(null);

//     const reader = new FileReader();

//     reader.onload = () => {
//       const result = reader.result as string;

//       setImageSrc(result);
//       setLandmarks([]);

//       runDetection(result);
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleImageLoad = (
//     e: React.SyntheticEvent<HTMLImageElement>
//   ) => {
//     const img = e.currentTarget;

//     setImgDims({
//       width: img.naturalWidth || 800,
//       height: img.naturalHeight || 800,
//     });
//   };

//   const runDetection = async (base64Image: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/detect", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           image: base64Image,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error || "Failed to analyze cephalogram"
//         );
//       }

//       if (data.predictions) {
//         setLandmarks(data.predictions);
//       }
//     } catch (err: any) {
//       console.error("Detection error:", err);

//       setError(
//         err.message ||
//           "An error occurred during landmark detection."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pointCount =
//     landmarks[0]?.keypoints?.length || 0;

//   return (
//     <main className="min-h-screen bg-[#070b12] text-white">
//       {/* =====================================================
//           TOP NAV
//       ====================================================== */}

//       <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070b12]/90 backdrop-blur-xl">
//         <div className="max-w-[1500px] mx-auto px-6 h-18 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
//               <svg
//                 width="21"
//                 height="21"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   d="M4 18V6M4 12H20M20 6V18"
//                   stroke="white"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             </div>

//             <div>
//               <h1 className="font-semibold tracking-tight">
//                 Ceph<span className="text-cyan-400">Vision</span>
//               </h1>

//               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
//                 AI Orthodontic Analysis
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-300 hover:bg-slate-900">
//               Save Analysis
//             </button>

//             <button
//               onClick={() => window.print()}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm transition"
//             >
//               <span>Export Report</span>
//               <span>↗</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-[1500px] mx-auto px-6 py-8">
//         {/* =====================================================
//             PATIENT HEADER
//         ====================================================== */}

//         <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
//               <span>Analysis</span>
//               <span>/</span>
//               <span>New Cephalometric Study</span>
//             </div>

//             <h1 className="text-3xl font-semibold tracking-tight">
//               Cephalometric Analysis
//             </h1>

//             <p className="text-slate-500 mt-2">
//               AI-assisted cephalometric assessment and
//               orthodontic treatment planning.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
//               ● Analysis workspace
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             PATIENT INFORMATION
//         ====================================================== */}

//         <Card className="p-6 mb-8">
//           <SectionHeader
//             number="01"
//             title="Patient Information"
//             description="Enter the patient's clinical information."
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//             <div>
//               <label className="block text-xs text-slate-500 mb-2">
//                 Patient Name
//               </label>

//               <input
//                 defaultValue=""
//                 placeholder="Enter patient name"
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-slate-500 mb-2">
//                 Patient ID
//               </label>

//               <input
//                 defaultValue=""
//                 placeholder="e.g. PT-000124"
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-slate-500 mb-2">
//                 Age
//               </label>

//               <input
//                 type="number"
//                 placeholder="Age"
//                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-slate-500 mb-2">
//                 Sex
//               </label>

//               <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition">
//                 <option value="">Select sex</option>
//                 <option>Male</option>
//                 <option>Female</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-5 pt-5 border-t border-slate-800">
//             <div className="flex items-center gap-2 text-sm text-slate-400">
//               <span className="text-cyan-400">◷</span>
//               Date of analysis
//               <span className="text-white">
//                 {new Date().toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </Card>

//         {/* =====================================================
//             MAIN ANALYSIS GRID
//         ====================================================== */}

//         <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_420px] gap-8">
//           {/* ===================================================
//               IMAGE
//           ==================================================== */}

//           <section>
//             <Card className="overflow-hidden">
//               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
//                 <div>
//                   <SectionHeader
//                     number="02"
//                     title="Cephalometric Image"
//                     description="AI-detected landmarks and tracing."
//                   />
//                 </div>

//                 {pointCount > 0 && (
//                   <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
//                     {pointCount} landmarks detected
//                   </div>
//                 )}
//               </div>

//               <div className="p-6">
//                 {!imageSrc ? (
//                   <label className="min-h-[650px] rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] transition">
//                     <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
//                       <svg
//                         width="28"
//                         height="28"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M12 16V4M12 4L7 9M12 4L17 9"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M5 14V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V14"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                     </div>

//                     <h3 className="text-lg font-medium mb-2">
//                       Upload cephalometric X-ray
//                     </h3>

//                     <p className="text-sm text-slate-500 text-center max-w-sm">
//                       Upload a lateral cephalometric radiograph
//                       to begin AI landmark detection.
//                     </p>

//                     <span className="mt-6 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-medium text-sm">
//                       Choose X-ray
//                     </span>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       disabled={loading}
//                       className="hidden"
//                     />
//                   </label>
//                 ) : (
//                   <>
//                     <div className="relative w-full aspect-square max-h-[760px] border border-slate-800 bg-black rounded-2xl overflow-hidden flex items-center justify-center">
//                       <img
//                         ref={imageRef}
//                         src={imageSrc}
//                         alt="Cephalogram"
//                         onLoad={handleImageLoad}
//                         className="absolute inset-0 w-full h-full object-contain pointer-events-none"
//                       />

//                       {pointCount > 0 && (
//                         <CephLandmarks
//                           landmarks={landmarks}
//                           onLandmarkChange={(updated) =>
//                             setLandmarks(updated)
//                           }
//                           imageDimensions={imgDims}
//                           showPlanes={true}
//                         />
//                       )}

//                       {loading && (
//                         <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center">
//                           <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />

//                           <p className="mt-4 text-sm font-medium">
//                             Analyzing cephalogram...
//                           </p>

//                           <p className="text-xs text-slate-500 mt-1">
//                             Detecting anatomical landmarks
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
//                       <div className="flex items-center gap-4 text-xs text-slate-500">
//                         <span>
//                           Image: {imgDims.width} ×{" "}
//                           {imgDims.height}px
//                         </span>

//                         {pointCount > 0 && (
//                           <span className="text-emerald-400">
//                             ● Landmarks detected
//                           </span>
//                         )}
//                       </div>

//                       <label className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300">
//                         Replace image
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </>
//                 )}

//                 {error && (
//                   <div className="mt-4 p-4 rounded-xl border border-red-900/50 bg-red-950/30 text-red-400 text-sm">
//                     {error}
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {pointCount > 0 && (
//               <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
//                   ↔
//                 </div>

//                 <p className="text-xs text-slate-400">
//                   <span className="text-slate-200 font-medium">
//                     Review the tracing:
//                   </span>{" "}
//                   Drag any landmark directly on the image to
//                   correct its position before finalizing the
//                   analysis.
//                 </p>
//               </div>
//             )}
//           </section>

//           {/* ===================================================
//               QUICK SUMMARY
//           ==================================================== */}

//           <aside className="space-y-5">
//             <Card className="p-5">
//               <div className="flex items-center justify-between mb-5">
//                 <div>
//                   <p className="text-xs text-slate-500 uppercase tracking-wider">
//                     Analysis status
//                   </p>

//                   <h3 className="text-lg font-semibold mt-1">
//                     {loading
//                       ? "Analyzing..."
//                       : pointCount > 0
//                       ? "Ready for review"
//                       : "Awaiting image"}
//                   </h3>
//                 </div>

//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     loading
//                       ? "bg-amber-400 animate-pulse"
//                       : pointCount > 0
//                       ? "bg-emerald-400"
//                       : "bg-slate-600"
//                   }`}
//                 />
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">
//                     Landmarks
//                   </span>
//                   <span>{pointCount || "—"}</span>
//                 </div>

//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">
//                     Measurements
//                   </span>
//                   <span className="text-slate-400">
//                     Pending
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">
//                     Findings
//                   </span>
//                   <span className="text-slate-400">
//                     Pending
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-5">
//               <h3 className="font-semibold mb-4">
//                 Tracing legend
//               </h3>

//               <div className="space-y-3 text-xs">
//                 <div className="flex items-center gap-3">
//                   <span className="w-8 border-t border-dashed border-rose-400" />
//                   <span className="text-slate-400">
//                     Sella → Nasion
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="w-8 border-t border-sky-400" />
//                   <span className="text-slate-400">
//                     Nasion → A / B
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="w-8 border-t border-emerald-400" />
//                   <span className="text-slate-400">
//                     Mandibular plane
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="w-8 border-t border-dashed border-amber-400" />
//                   <span className="text-slate-400">
//                     Palatal plane
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-5 bg-gradient-to-br from-cyan-500/[0.08] to-transparent">
//               <div className="flex items-start gap-3">
//                 <div className="text-cyan-400 text-xl">✦</div>

//                 <div>
//                   <h3 className="font-medium">
//                     AI-assisted analysis
//                   </h3>

//                   <p className="text-xs text-slate-500 mt-2 leading-5">
//                     AI findings should be reviewed and confirmed
//                     by the treating clinician before being used
//                     for patient care.
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </aside>
//         </div>

//         {/* =====================================================
//             MEASUREMENTS
//         ====================================================== */}

//         <Card className="mt-8 p-6">
//           <SectionHeader
//             number="03"
//             title="Cephalometric Measurements"
//             description="Angular and linear measurements generated from the detected landmarks."
//           />

//           <div className="hidden md:grid grid-cols-[1.2fr_0.7fr_1fr_1.5fr] gap-4 px-4 pb-3 text-[11px] uppercase tracking-wider text-slate-600">
//             <span>Measurement</span>
//             <span>Value</span>
//             <span>Reference</span>
//             <span>Interpretation</span>
//           </div>

//           <div className="bg-slate-950/50 rounded-xl px-4">
//             <MeasurementRow
//               name="SNA"
//               range="Reference range"
//             />

//             <MeasurementRow
//               name="SNB"
//               range="Reference range"
//             />

//             <MeasurementRow
//               name="ANB"
//               range="Reference range"
//             />

//             <MeasurementRow
//               name="Wits"
//               range="Reference range"
//             />

//             <MeasurementRow
//               name="FMA"
//               range="Reference range"
//             />

//             <MeasurementRow
//               name="IMPA"
//               range="Reference range"
//             />
//           </div>
//         </Card>

//         {/* =====================================================
//             FINDINGS
//         ====================================================== */}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//           <Card className="p-6">
//             <SectionHeader
//               number="04"
//               title="AI Findings"
//               description="Review and edit the findings generated from the analysis."
//             />

//             <div className="space-y-5">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="text-sm font-medium">
//                     Skeletal Findings
//                   </label>

//                   <span className="text-[10px] uppercase tracking-wider text-cyan-400">
//                     AI generated
//                   </span>
//                 </div>

//                 <textarea
//                   rows={5}
//                   placeholder="AI skeletal findings will appear here..."
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 outline-none resize-none focus:border-cyan-500 transition"
//                 />
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="text-sm font-medium">
//                     Dental Findings
//                   </label>

//                   <span className="text-[10px] uppercase tracking-wider text-cyan-400">
//                     AI generated
//                   </span>
//                 </div>

//                 <textarea
//                   rows={5}
//                   placeholder="AI dental findings will appear here..."
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 outline-none resize-none focus:border-cyan-500 transition"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* ===================================================
//               MALOCCLUSION
//           ==================================================== */}

//           <Card className="p-6">
//             <SectionHeader
//               number="05"
//               title="Malocclusion Classification"
//               description="Select or confirm the clinical classification."
//             />

//             <div className="grid grid-cols-3 gap-3">
//               {["Class I", "Class II", "Class III"].map(
//                 (item) => (
//                   <button
//                     key={item}
//                     className="py-5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:bg-cyan-500/[0.04] transition group"
//                   >
//                     <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 group-hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 mb-3">
//                       {item.replace("Class ", "")}
//                     </div>

//                     <span className="text-sm font-medium">
//                       {item}
//                     </span>
//                   </button>
//                 )
//               )}
//             </div>

//             <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">
//                   AI classification
//                 </span>

//                 <span className="text-sm text-slate-300">
//                   Awaiting analysis
//                 </span>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* =====================================================
//             TREATMENT PLAN
//         ====================================================== */}

//         <Card className="mt-8 p-6">
//           <SectionHeader
//             number="06"
//             title="Treatment Plan"
//             description="Select the proposed orthodontic treatment pathway."
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <button className="text-left p-6 rounded-2xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 transition">
//               <div className="flex items-start justify-between">
//                 <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl">
//                   ◇
//                 </div>

//                 <span className="text-xs text-slate-600">
//                   OPTION 01
//                 </span>
//               </div>

//               <h3 className="text-lg font-semibold mt-5">
//                 Fixed Braces
//               </h3>

//               <p className="text-sm text-slate-500 mt-2 leading-6">
//                 Conventional fixed orthodontic treatment with
//                 stage-by-stage archwire progression.
//               </p>

//               <div className="flex gap-2 mt-5 flex-wrap">
//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Wire progression
//                 </span>

//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Alignment
//                 </span>

//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Finishing
//                 </span>
//               </div>
//             </button>

//             <button className="text-left p-6 rounded-2xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 transition">
//               <div className="flex items-start justify-between">
//                 <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-xl">
//                   ◫
//                 </div>

//                 <span className="text-xs text-slate-600">
//                   OPTION 02
//                 </span>
//               </div>

//               <h3 className="text-lg font-semibold mt-5">
//                 Clear Aligners
//               </h3>

//               <p className="text-sm text-slate-500 mt-2 leading-6">
//                 Sequential clear aligner treatment with
//                 stage-by-stage movement objectives.
//               </p>

//               <div className="flex gap-2 mt-5 flex-wrap">
//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Staging
//                 </span>

//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Movement
//                 </span>

//                 <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400">
//                   Refinement
//                 </span>
//               </div>
//             </button>
//           </div>
//         </Card>

//         {/* =====================================================
//             TREATMENT OBJECTIVES
//         ====================================================== */}

//         <Card className="mt-6 p-6">
//           <SectionHeader
//             number="07"
//             title="Treatment Objectives"
//             description="Specific objectives derived from the clinical findings."
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {[
//               "Correct sagittal skeletal discrepancy",
//               "Improve incisor relationship",
//               "Establish appropriate overjet and overbite",
//               "Coordinate upper and lower dental arches",
//               "Improve dental alignment",
//               "Establish functional occlusion",
//             ].map((objective, index) => (
//               <div
//                 key={objective}
//                 className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
//               >
//                 <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-semibold">
//                   {String(index + 1).padStart(2, "0")}
//                 </div>

//                 <span className="text-sm text-slate-300">
//                   {objective}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* =====================================================
//             TREATMENT PATHWAY
//         ====================================================== */}

//         <Card className="mt-6 p-6">
//           <SectionHeader
//             number="08"
//             title="Treatment Pathway"
//             description="Visual stage-by-stage progression of the proposed treatment."
//           />

//           <div className="relative overflow-x-auto pb-4">
//             <div className="min-w-[950px]">
//               <div className="absolute left-10 right-10 top-[100px] h-px bg-slate-800" />

//               <div className="relative grid grid-cols-6 gap-4">
//                 {[
//                   {
//                     stage: "01",
//                     title: "Records",
//                     desc: "Initial records & planning",
//                   },
//                   {
//                     stage: "02",
//                     title: "Alignment",
//                     desc: "Initial alignment",
//                   },
//                   {
//                     stage: "03",
//                     title: "Leveling",
//                     desc: "Arch coordination",
//                   },
//                   {
//                     stage: "04",
//                     title: "Correction",
//                     desc: "Sagittal / transverse",
//                   },
//                   {
//                     stage: "05",
//                     title: "Finishing",
//                     desc: "Occlusal refinement",
//                   },
//                   {
//                     stage: "06",
//                     title: "Retention",
//                     desc: "Retention protocol",
//                   },
//                 ].map((stage, index) => (
//                   <div
//                     key={stage.stage}
//                     className="relative text-center"
//                   >
//                     <div className="h-20 flex flex-col items-center justify-end">
//                       <span className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">
//                         Stage
//                       </span>

//                       <h3 className="text-sm font-semibold">
//                         {stage.title}
//                       </h3>
//                     </div>

//                     <div
//                       className={`relative z-10 mx-auto w-10 h-10 rounded-full border flex items-center justify-center text-xs font-semibold ${
//                         index === 0
//                           ? "bg-cyan-500 border-cyan-400 text-slate-950"
//                           : "bg-slate-950 border-slate-700 text-slate-400"
//                       }`}
//                     >
//                       {stage.stage}
//                     </div>

//                     <p className="text-xs text-slate-500 mt-4 leading-5">
//                       {stage.desc}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/10">
//             <div className="flex gap-3">
//               <span className="text-cyan-400">✦</span>

//               <p className="text-xs text-slate-500 leading-5">
//                 The treatment pathway should be considered a
//                 planning aid and reviewed/modified by the
//                 treating clinician.
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* =====================================================
//             CLINICIAN NOTES
//         ====================================================== */}

//         <Card className="mt-6 p-6">
//           <SectionHeader
//             number="09"
//             title="Clinician Notes"
//             description="Document clinical observations, modifications and final decisions."
//           />

//           <textarea
//             rows={8}
//             placeholder="Add clinician notes, modifications to AI recommendations, treatment considerations..."
//             className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 placeholder:text-slate-700 outline-none resize-y focus:border-cyan-500 transition"
//           />

//           <div className="flex justify-end mt-4">
//             <button className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm text-slate-300 transition">
//               Save Notes
//             </button>
//           </div>
//         </Card>

//         {/* =====================================================
//             REPORT
//         ====================================================== */}

//         <Card className="mt-6 mb-10 p-6">
//           <SectionHeader
//             number="10"
//             title="Clinical Report"
//             description="Generate a printable patient analysis report."
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button
//               onClick={() => window.print()}
//               className="p-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-left transition"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold">
//                     Generate Clinical Report
//                   </h3>

//                   <p className="text-sm opacity-70 mt-1">
//                     Print or save this analysis as PDF.
//                   </p>
//                 </div>

//                 <span className="text-xl">↗</span>
//               </div>
//             </button>

//             <button className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-left transition">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold">
//                     Save Analysis
//                   </h3>

//                   <p className="text-sm text-slate-500 mt-1">
//                     Save this patient analysis for later review.
//                   </p>
//                 </div>

//                 <span className="text-xl text-slate-500">
//                   ↓
//                 </span>
//               </div>
//             </button>
//           </div>
//         </Card>

//         {/* =====================================================
//             FOOTER
//         ====================================================== */}

//         <footer className="border-t border-slate-900 py-8 text-center">
//           <p className="text-xs text-slate-600">
//             CephVision · AI-assisted orthodontic analysis
//           </p>

//           <p className="text-[10px] text-slate-700 mt-2">
//             Clinical findings and treatment recommendations
//             require professional review.
//           </p>
//         </footer>
//       </div>

//       {/* =====================================================
//           PRINT STYLES
//       ====================================================== */}

//       <style jsx global>{`
//         @media print {
//           body {
//             background: white !important;
//             color: black !important;
//           }

//           header,
//           footer,
//           button,
//           input[type="file"] {
//             display: none !important;
//           }

//           main {
//             background: white !important;
//           }

//           .bg-slate-900,
//           .bg-slate-950,
//           .bg-slate-900\\/70 {
//             background: white !important;
//           }

//           .border-slate-800,
//           .border-slate-900 {
//             border-color: #ddd !important;
//           }

//           .text-white,
//           .text-slate-200,
//           .text-slate-300 {
//             color: #111 !important;
//           }

//           .text-slate-400,
//           .text-slate-500,
//           .text-slate-600 {
//             color: #555 !important;
//           }

//           .text-cyan-400 {
//             color: #0891b2 !important;
//           }

//           .max-w-\\[1500px\\] {
//             max-width: 100% !important;
//           }

//           @page {
//             size: A4;
//             margin: 12mm;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }


"use client"

import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  Keypoint,
  PredictionObject,
  CephAnalysisResult,
  PatientInfo,
} from "@/types";
import { computeCephFromKeypoints } from "../utils/cephalometrics";
import { generateCephPdfReport } from "../utils/pdfExport"
import {
  Activity,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  Sparkles,
  Layers,
  Edit3,
  Check,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move,
  Info,
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   CEPHALOMETRIC LANDMARK OVERLAY
   Existing detection / dragging logic preserved & enhanced
========================================================= */

function CephLandmarks({
  landmarks = [],
  onLandmarkChange,
  imageDimensions,
  showPlanes = true,
  showLabels = true,
}: {
  landmarks: PredictionObject[];
  onLandmarkChange?: (updated: PredictionObject[]) => void;
  imageDimensions: { width: number; height: number };
  showPlanes?: boolean;
  showLabels?: boolean;
}) {
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);

  const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

  const keypointsList = rawKeypoints.map((kp) => ({
    ...kp,
    renderX: kp.x,
    renderY: kp.y,
  }));

  const getLM = (possibleLabels: string[], maxRelativeY?: number) => {
    const matches = keypointsList.filter((lm) =>
      possibleLabels.some(
        (label) => lm.class?.toLowerCase().trim() === label.toLowerCase().trim()
      )
    );

    if (matches.length === 0) return undefined;

    if (maxRelativeY !== undefined) {
      const upperMatches = matches.filter((m) => m.renderY <= maxRelativeY);
      if (upperMatches.length > 0) {
        return upperMatches.reduce((prev, curr) =>
          curr.renderY < prev.renderY ? curr : prev
        );
      }
    }

    return matches.reduce((prev, curr) =>
      (curr.confidence || 0) > (prev.confidence || 0) ? curr : prev
    );
  };

  const sella = getLM(["sella", "s"], 450);
  const nasion = getLM(["nasion", "n"], 350);
  const ans = getLM(["ans"]);
  const pns = getLM(["pns"]);
  const aPoint = getLM(["subspinale", "a_point", "a"]);
  const bPoint = getLM(["supramentale", "b_point", "b"]);
  const menton = getLM(["menton", "me"]);
  const pogonion = getLM(["pogonion", "pog"]);
  const gonion = getLM(["gonion", "go"]);
  const porion = getLM(["porion", "po"]);
  const orbitale = getLM(["orbitale", "or"]);
  const subnasale = getLM(["subnasale"]);
  const upperLip = getLM(["upper-lip", "upper_lip", "ls"]);
  const lowerLip = getLM(["lower-lip", "lower_lip", "li"]);
  const softPog = getLM(["soft-tissue-pogonion", "soft_pogonion", "pog_prime"]);
  const u1Tip = getLM(["upper-incisor-tip", "upper_incisor_tip", "u1_tip", "is"]);
  const l1Tip = getLM(["lower-incisor-tip", "lower_incisor_tip", "l1_tip", "ii"]);
  const l1Apex = getLM(["lower-incisor-apex", "lower_incisor_apex", "l1_apex", "ia"]);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeDragIndex === null || !onLandmarkChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const newRenderX = ((e.clientX - rect.left) / rect.width) * imageDimensions.width;
    const newRenderY = ((e.clientY - rect.top) / rect.height) * imageDimensions.height;

    const updatedKeypoints = [...rawKeypoints];
    updatedKeypoints[activeDragIndex] = {
      ...updatedKeypoints[activeDragIndex],
      x: Math.round(newRenderX),
      y: Math.round(newRenderY),
    };

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

  return (
    <svg
      viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
      className="absolute inset-0 w-full h-full z-20 cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      xmlns="http://www.w3.org/2000/svg"
    >
      {showPlanes && (
        <g className="pointer-events-none">
          {/* S-N Cranial Base */}
          {sella && nasion && (
            <line
              x1={sella.renderX}
              y1={sella.renderY}
              x2={nasion.renderX}
              y2={nasion.renderY}
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
          )}

          {/* Frankfort Horizontal Plane (Po - Or) */}
          {porion && orbitale && (
            <line
              x1={porion.renderX}
              y1={porion.renderY}
              x2={orbitale.renderX}
              y2={orbitale.renderY}
              stroke="#a855f7"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}

          {/* N-A Line */}
          {nasion && aPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={aPoint.renderX}
              y2={aPoint.renderY}
              stroke="#38bdf8"
              strokeWidth={1.5}
            />
          )}

          {/* N-B Line */}
          {nasion && bPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={bPoint.renderX}
              y2={bPoint.renderY}
              stroke="#0284c7"
              strokeWidth={1.5}
            />
          )}

          {/* Mandibular plane (Go - Me) */}
          {gonion && menton && (
            <line
              x1={gonion.renderX}
              y1={gonion.renderY}
              x2={menton.renderX}
              y2={menton.renderY}
              stroke="#10b981"
              strokeWidth={2}
            />
          )}

          {/* Palatal plane (ANS - PNS) */}
          {ans && pns && (
            <line
              x1={ans.renderX}
              y1={ans.renderY}
              x2={pns.renderX}
              y2={pns.renderY}
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )}

          {/* Lower incisor mandibular plane axis (L1 Apex -> L1 Tip) */}
          {l1Apex && l1Tip && (
            <line
              x1={l1Apex.renderX}
              y1={l1Apex.renderY}
              x2={l1Tip.renderX}
              y2={l1Tip.renderY}
              stroke="#ec4899"
              strokeWidth={1.5}
            />
          )}

          {/* Soft tissue profile contour */}
          {subnasale && upperLip && lowerLip && softPog && (
            <path
              d={`M ${subnasale.renderX} ${subnasale.renderY}
              Q ${upperLip.renderX} ${upperLip.renderY},
              ${lowerLip.renderX} ${lowerLip.renderY}
              T ${softPog.renderX} ${softPog.renderY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
          )}
        </g>
      )}

      {keypointsList.map((lm, idx) => (
        <g
          key={`${lm.class}-${idx}`}
          transform={`translate(${lm.renderX}, ${lm.renderY})`}
          onMouseDown={(e) => handleMouseDown(idx, e)}
          className="cursor-grab active:cursor-grabbing group"
        >
          <circle
            r={7}
            fill="#38bdf8"
            fillOpacity={0.35}
            stroke="#38bdf8"
            strokeWidth={1.5}
            className="transition-all duration-150 group-hover:scale-150"
          />

          <circle r={2.5} fill="#ffffff" />

          {showLabels && (
            <text
              x={9}
              y={-6}
              fill="#ffffff"
              fontSize={10}
              fontWeight="600"
              className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,1)]"
            >
              {lm.class}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* =========================================================
   UI HELPERS & COMPONENTS
========================================================= */

function SectionHeader({
  number,
  title,
  description,
  badge,
}: {
  number: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-semibold text-sm shrink-0">
          {number}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {title}
            </h2>
            {badge}
          </div>

          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function MeasurementRow({
  name,
  fullName,
  value = "—",
  unit = "°",
  norm,
  interpretation = "Awaiting analysis",
  status = "normal",
}: {
  name: string;
  fullName: string;
  value?: string | number;
  unit?: string;
  norm: string;
  interpretation?: string;
  status?: "normal" | "low" | "high" | "pending";
}) {
  const isPending = value === "—" || status === "pending";

  const getStatusBadge = () => {
    if (isPending) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">
          Pending
        </span>
      );
    }
    if (status === "high") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ▲ Increased
        </span>
      );
    }
    if (status === "low") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          ▼ Decreased
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        ● Normal
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.9fr_1fr_1.7fr] items-center gap-3 py-3.5 border-b border-slate-800/80 last:border-0 hover:bg-slate-900/40 px-3 rounded-lg transition">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-base">{name}</span>
          <span className="text-xs text-slate-400 hidden sm:inline">({fullName})</span>
        </div>
        <div className="text-[11px] text-slate-500 sm:hidden">{fullName}</div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-bold text-base">
          {typeof value === "number" ? `${value}${unit}` : value}
        </span>
        {getStatusBadge()}
      </div>

      <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800 inline-block w-fit">
        {norm}
      </div>

      <div className="text-sm text-slate-300 leading-snug">{interpretation}</div>
    </div>
  );
}

/* =========================================================
   SAMPLE DEMO CEPHALOGRAM X-RAY
========================================================= */
const SAMPLE_CEPH_URL ='/sample-ceph.jpeg'

/* =========================================================
   MAIN APPLICATION
========================================================= */

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<PredictionObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const [pdfStatus, setPdfStatus] = useState<string>("");

  const [imgDims, setImgDims] = useState<{ width: number; height: number }>({
    width: 800,
    height: 800,
  });

  const [showPlanes, setShowPlanes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Patient Demographic State
  const [patient, setPatient] = useState<PatientInfo>({
    name: "Alex Morgan",
    id: "PT-2026-089",
    age: "15",
    sex: "Female",
    date: new Date().toLocaleDateString(),
    doctorName: "Dr. Sarah Sterling, Orthodontist",
  });

  // AI Analysis Results State
  const [analysisData, setAnalysisData] = useState<CephAnalysisResult | null>(null);

  // Clinician Confirmed / Editable Findings
  const [editableFindings, setEditableFindings] = useState<{
    skeletal: string;
    dental: string;
    isConfirmed: boolean;
  }>({
    skeletal: "",
    dental: "",
    isConfirmed: false,
  });

  // Selected Malocclusion
  const [selectedMalocclusion, setSelectedMalocclusion] = useState<string>("Class II");

  // Selected Treatment Plan Tab
  const [selectedPlanTab, setSelectedPlanTab] = useState<"braces" | "aligners">("braces");

  // Custom Treatment Objectives & Notes
  const [customObjectives, setCustomObjectives] = useState<string[]>([]);
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>("");
  const [clinicianNotes, setClinicianNotes] = useState<string>(
    "Patient presents with Class II division 1 malocclusion with retrognathic mandible. High compliance expected. Recommended fixed appliance therapy or clear aligners with Class II elastics."
  );

  const imageRef = useRef<HTMLImageElement>(null);
  const cephContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setImageSrc(result);
      setLandmarks([]);
      runDetection(result);
    };

    reader.readAsDataURL(file);
  };

  const loadSampleCeph = () => {
    setError(null);
    setImageSrc(SAMPLE_CEPH_URL);
    setLandmarks([]);
    runDetection(SAMPLE_CEPH_URL);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgDims({
      width: img.naturalWidth || 800,
      height: img.naturalHeight || 800,
    });
  };

  const runDetection = async (base64Image: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          imageWidth: imgDims.width || 800,
          imageHeight: imgDims.height || 800,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze cephalogram");
      }

      if (data.predictions) {
        setLandmarks(data.predictions);
      }

      
    } catch (err: any) {
      console.error("Detection error:", err);
      setError(err.message || "An error occurred during cephalometric analysis.");
    } finally {
      setLoading(false);
    }
  };

  const runAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({         
          landmark: landmarks,
          imageWidth: imgDims.width || 800,
          imageHeight: imgDims.height || 800,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze cephalogram");
      }


      if (data.measurements) {
        setAnalysisData(data);
        setEditableFindings({
          skeletal: data.aiFindings?.skeletal || "",
          dental: data.aiFindings?.dental || "",
          isConfirmed: false,
        });

        if (data.malocclusion?.classification) {
          setSelectedMalocclusion(data.malocclusion.classification);
        }

        if (data.treatmentObjectives) {
          setCustomObjectives(data.treatmentObjectives);
        }
      }
    } catch (err: any) {
      console.error("Detection error:", err);
      setError(err.message || "An error occurred during cephalometric analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Recalculate measurements dynamically if user drags landmarks
  const handleLandmarkChange = (updated: PredictionObject[]) => {
    setLandmarks(updated);
    if (analysisData && updated[0]?.keypoints) {
      const realTimeAngles = computeCephFromKeypoints(updated[0].keypoints);
      setAnalysisData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          measurements: {
            ...prev.measurements,
            ...realTimeAngles,
          },
        };
      });
    }
  };

  console.log('landmarks',landmarks[0]?.keypoints)
  const handleAddObjective = () => {
    if (!newObjectiveInput.trim()) return;
    setCustomObjectives((prev) => [...prev, newObjectiveInput.trim()]);
    setNewObjectiveInput("");
  };

  const handleRemoveObjective = (index: number) => {
    setCustomObjectives((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadPdf = async () => {
    if (!analysisData) {
      alert("Please upload and analyze a cephalogram before downloading the report.");
      return;
    }

    setPdfGenerating(true);
    setPdfStatus("Initializing PDF report generator...");

    try {
      await generateCephPdfReport({
        patient,
        analysisData,
        activeMalocclusion: selectedMalocclusion,
        confirmedFindings: editableFindings,
        customNotes: clinicianNotes,
        cephContainerElement: cephContainerRef.current,
        onProgress: (status) => setPdfStatus(status),
      });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to export PDF report. You can also use the Print/Export button.");
    } finally {
      setPdfGenerating(false);
      setPdfStatus("");
    }
  };

  const pointCount = landmarks[0]?.keypoints?.length || 0;

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070b12]/90 backdrop-blur-xl">
        <div className="max-w-[1500px] mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5 text-slate-950 font-bold" />
            </div>

            <div>
              <h1 className="font-bold tracking-tight text-lg flex items-center gap-1.5">
                Ceph<span className="text-cyan-400">Vision</span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-medium">
                  AI v3.7
                </span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Orthodontic Cephalometric Diagnostic Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={loadSampleCeph}
              disabled={loading}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-900 hover:border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Sample Ceph</span>
            </button> */}

            <button
              onClick={handleDownloadPdf}
              disabled={!analysisData || pdfGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition shadow-lg ${
                analysisData
                  ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {pdfGenerating ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{pdfGenerating ? "Generating PDF..." : "Download Patient PDF"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-900 transition"
              title="Print View"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto px-6 py-8">
        {/* =====================================================
            PATIENT HEADER & STATUS
        ====================================================== */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
              <span>Orthodontics</span>
              <span>/</span>
              <span>Cephalometric Radiograph Analysis</span>
              <span>/</span>
              <span className="text-cyan-400">Diagnostic Study</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Cephalometric Analysis & Treatment Planning
            </h1>

            <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Automated anatomical landmark detection, cephalometric measurements (SNA, SNB, ANB, Wits, FMA, IMPA), skeletal and dental diagnostic findings, malocclusion classification, and comparative treatment pathways for fixed braces and clear aligners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                analysisData
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : loading
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  analysisData ? "bg-emerald-400" : loading ? "bg-amber-400" : "bg-slate-500"
                }`}
              />
              <span>
                {analysisData
                  ? "Analysis Complete & Ready"
                  : loading
                  ? "Gemini Analyzing Ceph..."
                  : "Awaiting Radiograph"}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            01. PATIENT INFORMATION
        ====================================================== */}
        <Card className="p-6 mb-8 border-slate-800">
          <SectionHeader
            number="01"
            title="Patient Clinical Information"
            description="Patient identification and study metadata included on clinical reports."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Patient Full Name
              </label>
              <input
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                placeholder="Enter patient name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Patient Chart / ID
              </label>
              <input
                value={patient.id}
                onChange={(e) => setPatient({ ...patient, id: e.target.value })}
                placeholder="e.g. PT-000124"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Age</label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                placeholder="Age (years)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Biological Sex</label>
              <select
                value={patient.sex}
                onChange={(e) => setPatient({ ...patient, sex: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="">Select sex</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Date of Analysis:</span>
              <span className="text-white font-medium">{patient.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Treating Clinician:</span>
              <input
                value={patient.doctorName}
                onChange={(e) => setPatient({ ...patient, doctorName: e.target.value })}
                className="bg-transparent border-b border-slate-700 text-slate-200 px-2 py-0.5 text-xs outline-none focus:border-cyan-400"
                placeholder="Dr. Name"
              />
            </div>
          </div>
        </Card>

        {/* =====================================================
            MAIN IMAGE & SUMMARY GRID
        ====================================================== */}
        <div className="grid grid-cols-1  gap-8">
          {/* ===================================================
              02. CEPHALOMETRIC IMAGE & TRACING
          ==================================================== */}
          <section>
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <SectionHeader
                  number="02"
                  title="Cephalometric Radiograph"
                  description="AI-detected anatomical landmarks, reference planes, and tracing overlay."
                />

                <div className="flex items-center gap-3">
                  {pointCount > 0 && (
                    <>
                      <button
                        onClick={() => setShowPlanes(!showPlanes)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                          showPlanes
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Planes</span>
                      </button>

                      <button
                        onClick={() => setShowLabels(!showLabels)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                          showLabels
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>Labels</span>
                      </button>

                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        {pointCount} landmarks
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                {!imageSrc ? (
                  <div className="space-y-4">
                    <label className="min-h-[580px] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/60 hover:bg-cyan-500/[0.02] transition p-8 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-inner">
                        <Activity className="w-10 h-10 text-cyan-400" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        Upload Lateral Cephalometric X-ray
                      </h3>

                      <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                        Upload a lateral skull radiograph (DICOM export, PNG, or JPG) to initiate deep cephalometric landmark tracing and AI orthodontic analysis.
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                          <Download className="w-4 h-4 rotate-180" />
                          Choose Radiograph
                        </span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading}
                        className="hidden"
                      />
                    </label>

                    <div>
                    {/* <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="text-xs text-slate-500">Don't have a cephalogram ready?</span>
                      <button
                        onClick={loadSampleCeph}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                      >
                        Try with Sample Cephalogram →
                      </button>
                    </div> */}
                     
                    
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      ref={cephContainerRef}
                      className="relative w-full aspect-square max-h-[760px] border border-slate-800 bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl"
                    >
                      <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Cephalogram"
                        onLoad={handleImageLoad}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />

                      {pointCount > 0 && (
                        <CephLandmarks
                          landmarks={landmarks}
                          onLandmarkChange={handleLandmarkChange}
                          imageDimensions={imgDims}
                          showPlanes={showPlanes}
                          showLabels={showLabels}
                        />
                      )}

                      {loading && (
                        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                          <div className="w-14 h-14 rounded-full border-3 border-slate-700 border-t-cyan-400 animate-spin mb-4" />
                          <p className="text-base font-bold text-white">
                            Analyzing Cephalogram...
                          </p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            Extracting anatomical landmarks, calculating SNA/SNB/ANB/FMA/IMPA, diagnosing skeletal and dental findings...
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Resolution: {imgDims.width} × {imgDims.height}px</span>
                        {pointCount > 0 && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {pointCount} Anatomical Points Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition">
                          Upload New Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {
                        landmarks.length >= 1 && (
                           <button disabled={loading} onClick={runAnalyze} className="px-6 cursor-pointer py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                          <Download className="w-4 h-4 rotate-180" />
                          {loading ? "Analyzing..." :'Analyze'}
                    </button> 
                        )
                     }
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="mt-4 p-4 rounded-xl border border-red-900/50 bg-red-950/30 text-red-400 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Analysis Notice</p>
                      <p className="text-xs text-red-300 mt-0.5">Error Analyzing image(Verify that ceph is in JPG)</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {pointCount > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Move className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Interactive Landmark Correction:</span>{" "}
                  You can click and drag any anatomical point (Sella, Nasion, A-Point, B-Point, Menton, Gonion, etc.) directly on the cephalogram to manually adjust landmark positions. Angular measurements will update in real-time.
                </p>
              </div>
            )}
          </section>

          {/* ===================================================
              RIGHT SIDEBAR: QUICK SUMMARY & TRACING LEGEND
          ==================================================== */}
          {
            customObjectives.length >= 1 && (
                <aside className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider">
                    Diagnostic Status
                  </p>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {loading
                      ? "AI Analysis in Progress..."
                      : analysisData
                      ? "Analysis Complete"
                      : "Awaiting Cephalogram"}
                  </h3>
                </div>

                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    loading
                      ? "bg-amber-400 animate-ping"
                      : analysisData
                      ? "bg-emerald-400 shadow-lg shadow-emerald-500/50"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Landmarks Traced</span>
                  <span className="font-semibold text-white">{pointCount || "—"}</span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Skeletal Classification</span>
                  <span className="font-semibold text-cyan-400">
                    {analysisData?.malocclusion?.classification || "Pending"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">ANB Sagittal Discrepancy</span>
                  <span className="font-semibold text-white">
                    {analysisData?.measurements?.ANB?.value
                      ? `${analysisData.measurements.ANB.value}°`
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5">
                  <span className="text-slate-400">Clinician Review</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      editableFindings.isConfirmed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {editableFindings.isConfirmed ? "Confirmed" : "Draft / In Review"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-white text-sm mb-3.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Cephalometric Tracing Legend
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 border-t-2 border-dashed border-rose-500" />
                    <span className="text-slate-300 font-medium">S-N Plane</span>
                  </div>
                  <span className="text-slate-500 font-mono">Cranial Base</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 border-t-2 border-purple-500" />
                    <span className="text-slate-300 font-medium">Frankfort (Po-Or)</span>
                  </div>
                  <span className="text-slate-500 font-mono">FMA Reference</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 border-t-2 border-sky-400" />
                    <span className="text-slate-300 font-medium">N-A & N-B Lines</span>
                  </div>
                  <span className="text-slate-500 font-mono">SNA / SNB</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 border-t-2 border-emerald-400" />
                    <span className="text-slate-300 font-medium">Mandibular (Go-Me)</span>
                  </div>
                  <span className="text-slate-500 font-mono">FMA / IMPA</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 border-t-2 border-dashed border-amber-400" />
                    <span className="text-slate-300 font-medium">Palatal (ANS-PNS)</span>
                  </div>
                  <span className="text-slate-500 font-mono">Maxillary Plane</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-900 border-cyan-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Clinical AI Interpretation
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Cephalometric calculations reflect standard Steiner, Tweed, and Jacobson (Wits) analyses. Clinicians can adjust values, edit findings, and confirm diagnosis before generating the patient PDF report.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
            )
          }
        </div>

        {
            customObjectives.length >= 1 && (
              <>
              {/* =====================================================
            03. CEPHALOMETRIC MEASUREMENTS TABLE
        ====================================================== */}
        <Card className="mt-8 p-6" id="measurements-section">
          <SectionHeader
            number="03"
            title="Cephalometric Measurements & Normative Ranges"
            description="Steiner, Tweed, and Wits angular and linear measurements compared against orthodontic population reference norms."
            badge={
              analysisData && (
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                  6 Core Metrics Analyzed
                </span>
              )
            }
          />

          <div className="hidden md:grid grid-cols-[1.4fr_0.9fr_1fr_1.7fr] gap-3 px-4 pb-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800">
            <span>Parameter & Description</span>
            <span>Measured Value</span>
            <span>Reference Norm</span>
            <span>Clinical Interpretation</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
            <MeasurementRow
              name="SNA"
              fullName="Sella-Nasion-A Point"
              value={analysisData?.measurements?.SNA?.value}
              unit="°"
              norm="82.0° (± 2.0°)"
              interpretation={
                analysisData?.measurements?.SNA?.interpretation ||
                "Maxillary sagittal position relative to anterior cranial base"
              }
              status={analysisData?.measurements?.SNA?.status || "pending"}
            />

            <MeasurementRow
              name="SNB"
              fullName="Sella-Nasion-B Point"
              value={analysisData?.measurements?.SNB?.value}
              unit="°"
              norm="80.0° (± 2.0°)"
              interpretation={
                analysisData?.measurements?.SNB?.interpretation ||
                "Mandibular sagittal position relative to anterior cranial base"
              }
              status={analysisData?.measurements?.SNB?.status || "pending"}
            />

            <MeasurementRow
              name="ANB"
              fullName="A Point-Nasion-B Point"
              value={analysisData?.measurements?.ANB?.value}
              unit="°"
              norm="2.0° (± 2.0°)"
              interpretation={
                analysisData?.measurements?.ANB?.interpretation ||
                "Maxillo-mandibular sagittal skeletal relationship (Class I: 0°-4°, Class II: >4°, Class III: <0°)"
              }
              status={analysisData?.measurements?.ANB?.status || "pending"}
            />

            <MeasurementRow
              name="Wits"
              fullName="Wits Appraisal (Linear)"
              value={analysisData?.measurements?.Wits?.value}
              unit=""
              norm="0.0 mm (♂ -1mm, ♀ 0mm)"
              interpretation={
                analysisData?.measurements?.Wits?.interpretation ||
                "Linear distance between perpendicular projections from A and B to functional occlusal plane"
              }
              status={analysisData?.measurements?.Wits?.status || "pending"}
            />

            <MeasurementRow
              name="FMA"
              fullName="Frankfort Mandibular Angle"
              value={analysisData?.measurements?.FMA?.value}
              unit="°"
              norm="25.0° (± 3.0°)"
              interpretation={
                analysisData?.measurements?.FMA?.interpretation ||
                "Vertical growth pattern (Normodivergent: 22°-28°, Hyperdivergent/High angle: >28°, Hypodivergent: <22°)"
              }
              status={analysisData?.measurements?.FMA?.status || "pending"}
            />

            <MeasurementRow
              name="IMPA"
              fullName="Incisor Mandibular Plane Angle"
              value={analysisData?.measurements?.IMPA?.value}
              unit="°"
              norm="90.0° (± 4.0°)"
              interpretation={
                analysisData?.measurements?.IMPA?.interpretation ||
                "Lower incisor inclination relative to mandibular plane (Proclined: >95°, Retroclined: <86°)"
              }
              status={analysisData?.measurements?.IMPA?.status || "pending"}
            />
          </div>
        </Card>

        {/* =====================================================
            04 & 05: AI FINDINGS & MALOCCLUSION CLASSIFICATION
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* ===================================================
              04. AI FINDINGS (DENTIST EDIT & CONFIRM)
          ==================================================== */}
          <Card className="p-6">
            <SectionHeader
              number="04"
              title="AI Diagnostic Findings"
              description="Review, customize, and clinically confirm the AI-generated skeletal and dental findings."
              badge={
                editableFindings.isConfirmed ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Confirmed
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Editable Draft
                  </span>
                )
              }
            />

            <div className="space-y-5">
              {/* Skeletal Findings Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <span>Skeletal Findings</span>
                  </label>
                  <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-medium">
                    Editable Field
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={editableFindings.skeletal}
                  onChange={(e) =>
                    setEditableFindings({
                      ...editableFindings,
                      skeletal: e.target.value,
                    })
                  }
                  placeholder={
                    loading
                      ? "Generating AI skeletal findings..."
                      : "AI skeletal findings will appear here upon cephalogram upload (maxillary/mandibular sagittal position, facial divergence, growth vector)..."
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none resize-y focus:border-cyan-500 transition leading-relaxed"
                />
              </div>

              {/* Dental Findings Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <span>Dental Findings</span>
                  </label>
                  <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-medium">
                    Editable Field
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={editableFindings.dental}
                  onChange={(e) =>
                    setEditableFindings({
                      ...editableFindings,
                      dental: e.target.value,
                    })
                  }
                  placeholder={
                    loading
                      ? "Generating AI dental findings..."
                      : "AI dental findings will appear here upon cephalogram upload (incisor inclinations, overjet, overbite, crowding, curve of Spee)..."
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none resize-y focus:border-cyan-500 transition leading-relaxed"
                />
              </div>

              {/* Confirm / Save Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (analysisData?.aiFindings) {
                      setEditableFindings({
                        skeletal: analysisData.aiFindings.skeletal || "",
                        dental: analysisData.aiFindings.dental || "",
                        isConfirmed: false,
                      });
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to AI Findings
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditableFindings({
                      ...editableFindings,
                      isConfirmed: !editableFindings.isConfirmed,
                    })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    editableFindings.isConfirmed
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {editableFindings.isConfirmed ? "Findings Confirmed ✓" : "Confirm Findings as Clinician"}
                  </span>
                </button>
              </div>
            </div>
          </Card>

          {/* ===================================================
              05. MALOCCLUSION CLASSIFICATION
          ==================================================== */}
          <Card className="p-6">
            <SectionHeader
              number="05"
              title="Malocclusion Classification"
              description="Clinical classification derived from cephalometric sagittal and vertical relationships."
            />

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "Class I", label: "Class I", desc: "Neutrocclusion / Normal Skeletal" },
                { id: "Class II", label: "Class II", desc: "Distocclusion / Retrognathic" },
                { id: "Class III", label: "Class III", desc: "Mesiocclusion / Prognathic" },
              ].map((item) => {
                const isActive = selectedMalocclusion.startsWith(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMalocclusion(item.id)}
                    className={`py-4 px-3 rounded-xl border text-center transition group relative ${
                      isActive
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/15"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm mb-2 transition ${
                        isActive
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-900 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {item.id.replace("Class ", "")}
                    </div>

                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* AI Malocclusion Breakdown Card */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Diagnostic Diagnosis
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  {analysisData?.malocclusion?.severity || "Moderate"} Severity
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="text-sm font-bold text-white">
                  {analysisData?.malocclusion?.subtype || `${selectedMalocclusion} Malocclusion`}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {analysisData?.malocclusion?.summary ||
                    "Awaiting cephalogram analysis to compute exact sagittal jaw discrepancy and dental occlusion relationship."}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Skeletal Pattern:</span>
                    <span className="text-cyan-300 font-medium mt-0.5 block">
                      {analysisData?.malocclusion?.skeletalPattern || "—"}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Dental Pattern:</span>
                    <span className="text-purple-300 font-medium mt-0.5 block">
                      {analysisData?.malocclusion?.dentalPattern || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* =====================================================
            06. TREATMENT PLANS (BRACES & ALIGNERS)
        ====================================================== */}
        <Card className="mt-8 p-6">
          <SectionHeader
            number="06"
            title="Orthodontic Treatment Plans"
            description="Detailed stage-by-stage clinical pathways and appliance specifications for Fixed Braces and Clear Aligners."
            badge={
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedPlanTab("braces")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedPlanTab === "braces"
                      ? "bg-cyan-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Fixed Braces Option
                </button>
                <button
                  onClick={() => setSelectedPlanTab("aligners")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedPlanTab === "aligners"
                      ? "bg-violet-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Clear Aligners Option
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OPTION 1: FIXED BRACES CARD */}
            <div
              className={`p-6 rounded-2xl border transition ${
                selectedPlanTab === "braces"
                  ? "border-cyan-500/50 bg-slate-950 ring-1 ring-cyan-500/20"
                  : "border-slate-800 bg-slate-950/60 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/20">
                    ⚙
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                      OPTION 01
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Fixed Appliance Therapy (Braces)
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {analysisData?.treatmentPlans?.braces?.duration || "18–24 Months"}
                </span>
              </div>

              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                {analysisData?.treatmentPlans?.braces?.description ||
                  "Comprehensive fixed pre-adjusted edgewise appliance system with continuous force delivery and 3D root torque control."}
              </p>

              {/* Wire Progression & Phases */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Stage-by-Stage Wire Progression
                </h4>

                {(
                  analysisData?.treatmentPlans?.braces?.phases || [
                    { stage: "Stage 01", title: "Alignment & Leveling", description: "0.014 NiTi → 0.018 NiTi round archwires to unravel crowding." },
                    { stage: "Stage 02", title: "Working Archwires", description: "0.019 × 0.025 SS with reverse curve of Spee and torque expression." },
                    { stage: "Stage 03", title: "Sagittal Mechanics", description: "Class II intermaxillary elastics on rigid rectangular wires." },
                    { stage: "Stage 04", title: "Finishing & Detailing", description: "Braided archwires and settling triangular elastics." },
                    { stage: "Stage 05", title: "Dual Retention", description: "Upper vacuum-formed Essix + Lower bonded 3-3 lingual wire." },
                  ]
                ).map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[11px] font-bold shrink-0 mt-0.5">
                      {phase.stage}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{phase.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{phase.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specifications Chips */}
              <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                {(
                  analysisData?.treatmentPlans?.braces?.specifications || [
                    { label: "Appliance", value: "0.022\" MBT Prescription" },
                    { label: "Anchorage", value: "Moderate / TPA Support" },
                  ]
                ).map((spec, i) => (
                  <div key={i} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">{spec.label}</span>
                    <span className="text-slate-200 font-medium text-xs mt-0.5 block truncate">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OPTION 2: CLEAR ALIGNERS CARD */}
            <div
              className={`p-6 rounded-2xl border transition ${
                selectedPlanTab === "aligners"
                  ? "border-violet-500/50 bg-slate-950 ring-1 ring-violet-500/20"
                  : "border-slate-800 bg-slate-950/60 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-lg border border-violet-500/20">
                    ✦
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-violet-400 font-bold">
                      OPTION 02
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Sequential Clear Aligners
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {analysisData?.treatmentPlans?.aligners?.duration || "16–22 Months"}
                </span>
              </div>

              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                {analysisData?.treatmentPlans?.aligners?.description ||
                  "Custom clear thermoformed aligners with optimized staging, precision bite ramps, IPR, and auxiliary elastics."}
              </p>

              {/* Aligner Stages & Phases */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Aligner Movement Protocol
                </h4>

                {(
                  analysisData?.treatmentPlans?.aligners?.phases || [
                    { stage: "Stage 01", title: "Staging & Attachments", description: "Bite ramps and optimized attachments on premolars and molars." },
                    { stage: "Stage 02", title: "Sequential Distalization", description: "Upper molar distalization (50% staging) with Class II button cutouts." },
                    { stage: "Stage 03", title: "IPR & Space Management", description: "Lower anterior IPR (0.3mm per contact) to relieve crowding." },
                    { stage: "Stage 04", title: "Anterior Retraction", description: "Overjet reduction and torque expression with palatal compensation." },
                    { stage: "Stage 05", title: "Refinement & Retention", description: "Digital refinement scan followed by Vivera / Essix retainers." },
                  ]
                ).map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[11px] font-bold shrink-0 mt-0.5">
                      {phase.stage}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{phase.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{phase.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specifications Chips */}
              <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                {(
                  analysisData?.treatmentPlans?.aligners?.specifications || [
                    { label: "Trays", value: "36 Active Stages + Refinements" },
                    { label: "Wear Time", value: "22 hrs/day (7-day change)" },
                  ]
                ).map((spec, i) => (
                  <div key={i} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">{spec.label}</span>
                    <span className="text-slate-200 font-medium text-xs mt-0.5 block truncate">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* =====================================================
            07. TREATMENT OBJECTIVES (PATIENT SPECIFIC)
        ====================================================== */}
        <Card className="mt-8 p-6">
          <SectionHeader
            number="07"
            title="Personalized Treatment Objectives"
            description="Clinical goals derived directly from this patient's cephalometric measurements and skeletal findings."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {(customObjectives.length > 0
              ? customObjectives
              : [
                  "Correct sagittal skeletal discrepancy (reduce ANB angle from high to norm)",
                  "Establish bilateral Class I canine and molar occlusion",
                  "Normalize overjet and overbite to 2.0 mm",
                  "Control and upright lower incisors (IMPA 90° ± 4°)",
                  "Level and coordinate upper and lower dental arches",
                  "Preserve vertical facial height and mandibular plane angle",
                  "Optimize facial profile, chin prominence, and lip competence",
                ]
            ).map((objective, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <span className="text-sm text-slate-200 font-medium leading-relaxed">
                    {objective}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveObjective(index)}
                  className="text-slate-600 hover:text-rose-400 p-1 transition"
                  title="Remove objective"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom objective */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={newObjectiveInput}
              onChange={(e) => setNewObjectiveInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddObjective()}
              placeholder="Add custom treatment objective for this patient..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 transition"
            />
            <button
              onClick={handleAddObjective}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Goal</span>
            </button>
          </div>
        </Card>

        {/* =====================================================
            08. TREATMENT PATHWAY
        ====================================================== */}
        <Card className="mt-8 p-6">
          <SectionHeader
            number="08"
            title="Treatment Progression Pathway"
            description="Standard clinical roadmap from initial records to long-term retention."
          />

          <div className="relative overflow-x-auto pb-4">
            <div className="min-w-[950px]">
              <div className="absolute left-10 right-10 top-[75px] h-0.5 bg-slate-800" />

              <div className="relative grid grid-cols-6 gap-4">
                {[
                  { stage: "01", title: "Diagnostic Records", desc: "Ceph tracing, 3D scans, photos & plan" },
                  { stage: "02", title: "Alignment", desc: "Initial NiTi wires or aligners 1-6" },
                  { stage: "03", title: "Leveling", desc: "Curve of Spee & arch coordination" },
                  { stage: "04", title: "Sagittal Correction", desc: "Class II/III mechanics & space closure" },
                  { stage: "05", title: "Finishing", desc: "Occlusal detailing & intercuspation" },
                  { stage: "06", title: "Retention", desc: "Essix + bonded lingual retainers" },
                ].map((stage, index) => (
                  <div key={stage.stage} className="relative text-center">
                    <div className="h-16 flex flex-col items-center justify-end">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
                        Phase
                      </span>
                      <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                    </div>

                    <div
                      className={`relative z-10 mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition ${
                        index === 0
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30"
                          : "bg-slate-950 border-slate-700 text-slate-400"
                      }`}
                    >
                      {stage.stage}
                    </div>

                    <p className="text-xs text-slate-400 mt-3.5 leading-snug px-1">{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* =====================================================
            09. CLINICIAN NOTES
        ====================================================== */}
        <Card className="mt-8 p-6">
          <SectionHeader
            number="09"
            title="Clinician Clinical Notes & Case Directives"
            description="Add custom clinical observations, patient instructions, biomechanical considerations, and approval notes for inclusion in the patient report."
          />

          <textarea
            rows={5}
            value={clinicianNotes}
            onChange={(e) => setClinicianNotes(e.target.value)}
            placeholder="Add clinician notes, patient compliance notes, extraction vs non-extraction rationale..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-y focus:border-cyan-500 transition leading-relaxed"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={() => alert("Clinician notes saved to current study.")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Clinical Notes</span>
            </button>
          </div>
        </Card>

        {/* =====================================================
            10. CLINICAL REPORT EXPORT
        ====================================================== */}
        <Card className="mt-8 mb-12 p-6 border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30">
          <SectionHeader
            number="10"
            title="Patient Clinical Report Generation"
            description="Generate a professional multi-page PDF report with traced cephalogram, normative measurements, AI findings, malocclusion classification, and treatment plans."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPdf}
              disabled={!analysisData || pdfGenerating}
              className={`p-6 rounded-2xl text-left transition flex items-center justify-between ${
                analysisData
                  ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/25 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                  PDF REPORT EXPORT
                </span>
                <h3 className="text-xl font-bold mt-1">
                  {pdfGenerating ? "Generating Patient Report..." : "Download Full PDF Report"}
                </h3>
                <p className="text-sm opacity-80 mt-1">
                  {pdfStatus || "Includes traced ceph, measurements table, findings, and treatment plan."}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center font-bold text-xl shrink-0">
                {pdfGenerating ? (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
              </div>
            </button>

            <button
              onClick={() => window.print()}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  PRINT DOCUMENT
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Print / Save as PDF
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Standard browser high-resolution print view.
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                <Printer className="w-6 h-6" />
              </div>
            </button>
          </div>
        </Card>

              </>     
            )
        }     
        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="border-t border-slate-900 pt-8 pb-12 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-400">
            CephVision Orthodontic Diagnostic Suite · Powered by Google Gemini 3.7 Flash
          </p>
          <p className="text-[11px] text-slate-600 mt-2 max-w-xl mx-auto">
            Diagnostic calculations and AI treatment proposals are designed as clinical planning aids. All orthodontic diagnoses and prescriptions require review and validation by a licensed orthodontic professional.
          </p>
        </footer>
      </div>

      {/* =====================================================
          PRINT STYLES FOR DIRECT BROWSER PRINTING
      ====================================================== */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header,
          footer,
          button,
          input[type="file"] {
            display: none !important;
          }
          main {
            background: white !important;
          }
          .bg-slate-900,
          .bg-slate-950,
          .bg-slate-900\\/80,
          .bg-slate-900\\/60 {
            background: white !important;
          }
          .border-slate-800,
          .border-slate-900 {
            border-color: #e2e8f0 !important;
          }
          .text-white,
          .text-slate-200,
          .text-slate-300 {
            color: #0f172a !important;
          }
          .text-slate-400,
          .text-slate-500,
          .text-slate-600 {
            color: #475569 !important;
          }
          .text-cyan-400 {
            color: #0284c7 !important;
          }
          .max-w-\\[1500px\\] {
            max-width: 100% !important;
          }
          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>
    </main>
  );
}
