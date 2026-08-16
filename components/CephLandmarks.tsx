'use client';

import React, { useState } from 'react';

export interface Landmark {
  id?: string;
  class: string;
  x: number;
  y: number;
  confidence?: number;
}

interface CephLandmarksProps {
  landmarks?: Landmark[];
  onLandmarkChange?: (updatedLandmarks: Landmark[]) => void;
  selectedId?: string;
  onSelectLandmark?: (id: string) => void;
  showPlanes?: boolean;
}

export default function CephLandmarks({
  landmarks = [],
  onLandmarkChange,
  selectedId,
  onSelectLandmark,
  showPlanes = true,
}: CephLandmarksProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Guarantee array safety
  const safeLandmarks = Array.isArray(landmarks) ? landmarks : [];

  // Helper function to find landmarks by class or id safely (NO landmarks[0]!)
  const getLM = (idOrLabel: string) =>
    safeLandmarks.find(
      (lm) =>
        lm.class?.toLowerCase() === idOrLabel.toLowerCase() ||
        lm.id?.toLowerCase() === idOrLabel.toLowerCase()
    );

  const sella = getLM('sella') || getLM('S');
  const nasion = getLM('nasion') || getLM('N');
  const aPoint = getLM('ans') || getLM('a_point') || getLM('A');
  const bPoint = getLM('b_point') || getLM('B');
  const menton = getLM('menton') || getLM('Me');
  const gonion = getLM('gonion') || getLM('Go');

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragId(id);
    if (onSelectLandmark) onSelectLandmark(id);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeDragId || !onLandmarkChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const updated = safeLandmarks.map((lm) => {
      const lmId = lm.id || lm.class;
      return lmId === activeDragId ? { ...lm, x, y } : lm;
    });

    onLandmarkChange(updated);
  };

  const handleMouseUp = () => {
    setActiveDragId(null);
  };

  return (
    <svg
      viewBox="0 0 800 800"
      className="absolute inset-0 w-[800px] h-[800px] z-20 cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. ANATOMICAL PLANES & REFERENCE LINES */}
      {showPlanes && (
        <g className="pointer-events-none opacity-80">
          {/* S-N Line */}
          {sella && nasion && (
            <line
              x1={sella.x}
              y1={sella.y}
              x2={nasion.x}
              y2={nasion.y}
              stroke="#e11d48"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}

          {/* N-A Line */}
          {nasion && aPoint && (
            <line
              x1={nasion.x}
              y1={nasion.y}
              x2={aPoint.x}
              y2={aPoint.y}
              stroke="#3b82f6"
              strokeWidth={1.5}
            />
          )}

          {/* N-B Line */}
          {nasion && bPoint && (
            <line
              x1={nasion.x}
              y1={nasion.y}
              x2={bPoint.x}
              y2={bPoint.y}
              stroke="#06b6d4"
              strokeWidth={1.5}
            />
          )}

          {/* Mandibular Plane (Gonion to Menton) */}
          {gonion && menton && (
            <line
              x1={gonion.x}
              y1={gonion.y}
              x2={menton.x}
              y2={menton.y}
              stroke="#10b981"
              strokeWidth={2}
            />
          )}
        </g>
      )}

      {/* 2. DRAGGABLE LANDMARK DOTS */}
      {safeLandmarks.map((lm, idx) => {
        const id = lm.id || lm.class || `lm-${idx}`;
        const isSelected = id === selectedId;
        const color = '#38bdf8';

        return (
          <g
            key={id}
            transform={`translate(${lm.x}, ${lm.y})`}
            onMouseDown={(e) => handleMouseDown(id, e)}
            className="cursor-grab active:cursor-grabbing group"
          >
            {/* Outer ring */}
            <circle
              r={isSelected ? 10 : 6}
              fill={color}
              fillOpacity={0.25}
              stroke={color}
              strokeWidth={1.5}
              className="transition-all duration-150 group-hover:scale-125"
            />

            {/* Precision center dot */}
            <circle r={2.5} fill="#ffffff" />

            {/* Label */}
            <text
              x={8}
              y={-8}
              fill="#ffffff"
              fontSize={11}
              fontWeight="bold"
              className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            >
              {lm.class || lm.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}