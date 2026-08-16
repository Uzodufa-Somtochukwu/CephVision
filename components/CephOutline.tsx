'use client';

import React from 'react';

interface CephOutlineProps {
  strokeColor?: string;
  strokeWidth?: number;
}

export default function CephOutline({
  strokeColor = '#38bdf8', // High-visibility cyan
  strokeWidth = 2,
}: CephOutlineProps) {
  return (
    <svg
      viewBox="0 0 800 800"
      className="absolute inset-0 w-[800px] h-[800px] pointer-events-none z-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. SOFT TISSUE PROFILE (Forehead -> Nasal Bridge -> Nose Tip) */}
      <path
        d="
          M 520 120
          C 550 180, 560 240, 545 290
          C 540 310, 555 330, 580 355
          C 610 385, 645 405, 655 415
          C 660 422, 635 430, 605 435
        "
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />

      {/* 2. OBTUSE MANDIBULAR ANGLE (Posterior Ramus -> Gonion -> Inferior Border / Base) */}
      <path
        d="
          M 380 430
          L 365 590
          L 530 635
        "
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}