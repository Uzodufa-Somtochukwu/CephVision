import { Keypoint, PredictionObject } from "@/types";
import { useState } from "react";

export function CephLandmarks({
  landmarks = [],
  onLandmarkChange,
  imageDimensions,
  showPlanes = true,
  showLabels = true,
}: {
  landmarks: PredictionObject[];
  onLandmarkChange?: (updated: PredictionObject[]) => void;
  imageDimensions: {
    width: number;
    height: number;
  };
  showPlanes?: boolean;
  showLabels?: boolean;
}) {
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);

  const rawKeypoints: Keypoint[] = landmarks[0]?.keypoints || [];

  const extraKeypoints = rawKeypoints.map((kp) => ({
    ...kp,
    renderX: kp.x,
    renderY: kp.y,
  }));
  const gonionPoints = extraKeypoints.find((i) => i.class === "gonion");

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
  const aPoint = getLM(["subspinale", "a_point", "a"]);
  const bPoint = getLM(["supramentale", "b_point", "b"]);
  const menton = getLM(["mention", "me"]);
  const gonion = getLM(["gonion", "go"]);
  const xgonion = getLM(["xgonion"]);
  const porion = getLM(["ponion", "po"]);
  const orbitale = getLM(["orbitale", "or"]);
  const subnasale = getLM(["subnasale"]);
  const upperLip = getLM(["upper-lip", "upper_lip", "ls"]);
  const lowerLip = getLM(["lower-lip", "lower_lip", "li"]);
  const softPog = getLM(["soft-tissue-pogonion", "soft_pogonion", "pog_prime"]);

  const u1Tip = getLM([
    "upper-incisor-tip",
    "upper_incisor_tip",
    "u1_tip",
    "is",
  ]);

  const l1Tip = getLM([
    "lower-incisor-tip",
    "lower_incisor_tip",
    "l1_tip",
    "ii",
  ]);

  const l1Apex = getLM([
    "lower-incisor-apex",
    "lower_incisor_apex",
    "l1_apex",
    "ia",
  ]);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeDragIndex === null || !onLandmarkChange) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const newRenderX =
      ((e.clientX - rect.left) / rect.width) * imageDimensions.width;

    const newRenderY =
      ((e.clientY - rect.top) / rect.height) * imageDimensions.height;

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
      className="absolute inset-0 z-20 h-full w-full cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      xmlns="http://www.w3.org/2000/svg"
    >
      {showPlanes && (
        <g className="pointer-events-none">
          {sella && nasion && (
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

          
          
           {porion && orbitale && 
            (() => {
              const dx = porion.renderX - orbitale.renderX;
              const dy = porion.renderY - orbitale.renderY;

              // How far beyond pns you want the line to extend
              const extension = 750;
              const extensionA = -150;

              // Normalize the direction vector
              const length = Math.sqrt(dx * dx + dy * dy);

              const unitX = dx / length;
              const unitY = dy / length;

              // New endpoint beyond Gonion
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


          {nasion && aPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={aPoint.renderX}
              y2={aPoint.renderY}
              stroke="#22c55e"
              strokeWidth={1.5}
            />
          )}

          {nasion && bPoint && (
            <line
              x1={nasion.renderX}
              y1={nasion.renderY}
              x2={bPoint.renderX}
              y2={bPoint.renderY}
              stroke="#16a34a"
              strokeWidth={1.5}
            />
          )}

          {gonion &&
            menton &&
            (() => {
              const dx = gonion.renderX - menton.renderX;
              const dy = gonion.renderY - menton.renderY;

              // How far beyond Gonion you want the line to extend
              const extension = 550;

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


 {ans &&
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

          {subnasale && upperLip && lowerLip && softPog && (
            <path
              d={`M ${subnasale.renderX} ${subnasale.renderY}
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

      {keypointsList.map((lm, idx) => (
        <g
          key={`${lm.class}-${idx}`}
          transform={`translate(${lm.renderX}, ${lm.renderY})`}
          onMouseDown={(e) => handleMouseDown(idx, e)}
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
              {lm.class}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
