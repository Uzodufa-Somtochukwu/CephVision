import { Point } from "./svg-angle";

type LinearMeasurementProps = {
  p1: Point;
  p2: Point;
  label: string;
  pixelsPerMm: number;
  color?: string;
};

export function LinearMeasurement({
  p1,
  p2,
  label,
  pixelsPerMm,
  color = "#facc15",
}: LinearMeasurementProps) {
  const dx = p2.renderX - p1.renderX;
  const dy = p2.renderY - p1.renderY;

  const pixelDistance = Math.hypot(dx, dy);

  if (!pixelDistance || !pixelsPerMm) {
    return null;
  }

  const distance = pixelDistance / pixelsPerMm;

  // Midpoint
  const midX = (p1.renderX + p2.renderX) / 2;
  const midY = (p1.renderY + p2.renderY) / 2;

  // Perpendicular offset for the label
  const offset = 15;

  const normalX = -dy / pixelDistance;
  const normalY = dx / pixelDistance;

  const labelX = midX + normalX * offset;
  const labelY = midY + normalY * offset;

  return (
    <g className="pointer-events-none">
      {/* Measurement line */}
      <line
        x1={p1.renderX}
        y1={p1.renderY}
        x2={p2.renderX}
        y2={p2.renderY}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 3"
      />

      {/* Endpoint markers */}
      <circle
        cx={p1.renderX}
        cy={p1.renderY}
        r={3}
        fill={color}
      />

      <circle
        cx={p2.renderX}
        cy={p2.renderY}
        r={3}
        fill={color}
      />

      {/* Measurement label */}
      <text
        x={labelX}
        y={labelY}
        fill={color}
        fontSize={12}
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          paintOrder: "stroke",
          stroke: "#000",
          strokeWidth: 3,
        }}
      >
        {label} {distance.toFixed(1)} mm
      </text>
    </g>
  );
}