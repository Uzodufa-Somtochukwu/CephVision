'use client';

import React, { useState, ChangeEvent, useRef } from 'react';

export interface Keypoint {
id?: string;
class: string;
x: number;
y: number;
confidence?: number;
}

export interface PredictionObject {
keypoints?: Keypoint[];
[key: string]: any;
}

function CephLandmarks({
landmarks = [],
onLandmarkChange,
imageDimensions,
showPlanes = true,
}: {
landmarks: PredictionObject[];
onLandmarkChange?: (updated: PredictionObject[]) => void;
imageDimensions: { width: number; height: number };
showPlanes?: boolean;
}) {
const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);

const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

// Calculate scale factor relative to 800x800 container
const scaleX = imageDimensions.width ? 800 / imageDimensions.width : 1;
const scaleY = imageDimensions.height ? 800 / imageDimensions.height : 1;

// Scaled points for rendering on screen
const keypointsList = rawKeypoints.map((kp) => ({
...kp,
renderX: kp.x > 800 ? kp.x * scaleX : kp.x,
renderY: kp.y > 800 ? kp.y * scaleY : kp.y,
}));

// Helper to find landmark by strict class name, filtering out misplaced jaw points for upper landmarks
const getLM = (possibleLabels: string[], maxRelativeY?: number) => {
const matches = keypointsList.filter((lm) =>
possibleLabels.some(
(label) => lm.class?.toLowerCase() === label.toLowerCase()
)
);

if (matches.length === 0) return undefined;

// If a max Y-limit is set (e.g. Nasion should be in top half of image, y < 400), filter out points lower down
if (maxRelativeY !== undefined) {
const upperMatches = matches.filter((m) => m.renderY <= maxRelativeY);
if (upperMatches.length > 0) {
// Return the highest point (smallest Y) among valid matches
return upperMatches.reduce((prev, curr) =>
curr.renderY < prev.renderY ? curr : prev
);
}
}

// Fallback to highest confidence or first match
return matches.reduce((prev, curr) =>
(curr.confidence || 0) > (prev.confidence || 0) ? curr : prev
);
};

// Precise landmark lookups with position sanity checks
const sella = getLM(['sella', 's'], 450);
const nasion = getLM(['nasion', 'n'], 350); // Nasion MUST be near the top nasal bridge (Y < 350)
const ans = getLM(['ans']);
const pns = getLM(['pns']);
const aPoint = getLM(['subspinale', 'a_point', 'a']);
const bPoint = getLM(['supramentale', 'b_point', 'b']);
const menton = getLM(['menton', 'me']);
const pogonion = getLM(['pogonion', 'pog']);
const gonion = getLM(['gonion', 'go']);
const subnasale = getLM(['subnasale']);
const upperLip = getLM(['upper-lip', 'upper_lip']);
const lowerLip = getLM(['lower-lip', 'lower_lip']);
const softPog = getLM(['soft-tissue-pogonion', 'soft_pogonion']);

const handleMouseDown = (index: number, e: React.MouseEvent) => {
e.stopPropagation();
setActiveDragIndex(index);
};

const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
if (activeDragIndex === null || !onLandmarkChange) return;

const rect = e.currentTarget.getBoundingClientRect();
const newRenderX = Math.round(e.clientX - rect.left);
const newRenderY = Math.round(e.clientY - rect.top);

const originalX = imageDimensions.width ? Math.round(newRenderX / scaleX) : newRenderX;
const originalY = imageDimensions.height ? Math.round(newRenderY / scaleY) : newRenderY;

const updatedKeypoints = [...rawKeypoints];
updatedKeypoints[activeDragIndex] = {
...updatedKeypoints[activeDragIndex],
x: originalX,
y: originalY,
};

onLandmarkChange([{ ...landmarks[0], keypoints: updatedKeypoints }]);
};

const handleMouseUp = () => {
setActiveDragIndex(null);
};

return (
<svg
viewBox="0 0 800 800"
className="absolute inset-0 w-full h-full z-20 cursor-crosshair select-none"
onMouseMove={handleMouseMove}
onMouseUp={handleMouseUp}
onMouseLeave={handleMouseUp}
xmlns="http://www.w3.org/2000/svg"
>
{showPlanes && (
<g className="pointer-events-none">
{/* Red Dashed S-N Line (Cranial Base) */}
{sella && nasion && (
<line
x1={sella.renderX}
y1={sella.renderY}
x2={nasion.renderX}
y2={nasion.renderY}
stroke="#f43f5e"
strokeWidth={2}
strokeDasharray="4 3"
/>
)}

{/* Blue N-A Line */}
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

{/* Blue N-B Line */}
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

{/* Mandibular Plane (Gonion to Menton) */}
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

{/* Palatal Plane (ANS to PNS) */}
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

{/* Soft Tissue Contour */}
{subnasale && upperLip && lowerLip && softPog && (
<path
d={`M ${subnasale.renderX} ${subnasale.renderY} Q ${upperLip.renderX} ${upperLip.renderY}, ${lowerLip.renderX} ${lowerLip.renderY} T ${softPog.renderX} ${softPog.renderY}`}
fill="none"
stroke="#38bdf8"
strokeWidth={2}
strokeDasharray="4 3"
/>
)}
</g>
)}

{/* Render ALL 19 Landmarks */}
{keypointsList.map((lm, idx) => (
<g
key={`${lm.class}-${idx}`}
transform={`translate(${lm.renderX}, ${lm.renderY})`}
onMouseDown={(e) => handleMouseDown(idx, e)}
className="cursor-grab active:cursor-grabbing group"
>
<circle
r={6}
fill="#38bdf8"
fillOpacity={0.4}
stroke="#38bdf8"
strokeWidth={1.5}
className="transition-all duration-150 group-hover:scale-150"
/>

<circle r={2.5} fill="#ffffff" />

<text
x={8}
y={-6}
fill="#ffffff"
fontSize={11}
fontWeight="bold"
className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,1)]"
>
{lm.class}
</text>
</g>
))}
</svg>
);
}

export default function Home() {
const [imageSrc, setImageSrc] = useState<string | null>(null);
const [landmarks, setLandmarks] = useState<PredictionObject[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [imgDims, setImgDims] = useState<{ width: number; height: number }>({
width: 800,
height: 800,
});

const imageRef = useRef<HTMLImageElement>(null);

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
const response = await fetch('/api/detect', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ image: base64Image }),
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.error || 'Failed to analyze cephalogram');
}

if (data.predictions) {
setLandmarks(data.predictions);
}
} catch (err: any) {
console.error('Detection error:', err);
setError(err.message || 'An error occurred during landmark detection.');
} finally {
setLoading(false);
}
};

const pointCount = landmarks[0]?.keypoints?.length || 0;

return (
<main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
<h1 className="text-3xl font-bold mb-6">CephVision Landmark Detection</h1>

<div className="mb-6">
<label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors inline-block">
{loading ? 'Analyzing Image...' : 'Upload Cephalogram'}
<input
type="file"
accept="image/*"
onChange={handleImageUpload}
disabled={loading}
className="hidden"
/>
</label>
</div>

{error && (
<div className="mb-4 text-red-400 bg-red-950/50 border border-red-800 px-4 py-2 rounded-md max-w-xl text-center">
{error}
</div>
)}

<div className="relative w-[800px] h-[800px] border border-gray-800 bg-black rounded-lg overflow-hidden flex items-center justify-center">
{imageSrc ? (
<>
{/* eslint-disable-next-line @next/next/no-img-element */}
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
onLandmarkChange={(updated) => setLandmarks(updated)}
imageDimensions={imgDims}
showPlanes={true}
/>
)}
</>
) : (
<p className="text-gray-500">Upload an X-ray image to begin analysis</p>
)}
</div>

{pointCount > 0 && (
<div className="mt-6 w-[800px] bg-gray-900 border border-gray-800 p-4 rounded-lg">
<h2 className="text-lg font-semibold mb-2">Detected Landmarks ({pointCount})</h2>
<p className="text-xs text-gray-400">
Drag any landmark point directly on the overlay to adjust its coordinates.
</p>
</div>
)}
</main>
);
}