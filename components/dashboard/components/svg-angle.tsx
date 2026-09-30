import { useAppContext } from "@/providers/context-provider";
import { calculateAngle } from "@/utils/helpers";
import { useEffect } from "react";

export type Point = {
  renderX: number;
  renderY: number;
};

type AngleAnnotationProps = {
  p1: Point;
  vertex: Point;
  p2: Point;
  p3?:Point;
  label: string;
  radius?: number;
  color?: string;

  calculation?: "standard" | "anb";

  labelOffsetX?: number;
  labelOffsetY?: number;
};

export const AngleAnnotation = ({
  p1,
  vertex,
  p2,
  p3,
  label,
  radius = 35,
  color = "#facc15",

  calculation = "standard",

  labelOffsetX = 0,
  labelOffsetY= 0 
}: AngleAnnotationProps) => {

  const { setAngle } = useAppContext()
const calculateANB = (
  sella: Point,
  nasion: Point,
  aPoint: Point,
  bPoint: Point
) => {
  const sna = calculateAngle(
    sella,
    nasion,
    aPoint
  );

  const snb = calculateAngle(
    sella,
    nasion,
    bPoint
  );

  if (sna === null || snb === null) {
    return null;
  }

  return sna - snb;
};

let angle: number | null = null;
if(calculation === 'anb'){
    angle = calculateANB(p1,vertex,p2,p3 as Point)
}

if (calculation === "standard") {
  angle = calculateAngle(
    p1,
    vertex,
    p2
  );
}
  
  
   
  

  if (angle === null) return null;

  const angle1 = Math.atan2(
    p1?.renderY - vertex?.renderY,
    p1?.renderX - vertex?.renderX
  );

  const angle2 = Math.atan2(
    p2?.renderY - vertex?.renderY,
    p2?.renderX - vertex?.renderX
  );

  // Normalize so we draw the smaller angle
  let startAngle = angle1;
  let endAngle = angle2;

  let difference = endAngle - startAngle;

  while (difference > Math.PI) {
    difference -= 2 * Math.PI;
  }

  while (difference < -Math.PI) {
    difference += 2 * Math.PI;
  }

  if (difference < 0) {
    [startAngle, endAngle] = [endAngle, startAngle];
    difference = -difference;
  }

  const startX =
    vertex.renderX + radius * Math.cos(startAngle);

  const startY =
    vertex.renderY + radius * Math.sin(startAngle);

  const endX =
    vertex.renderX + radius * Math.cos(endAngle);

  const endY =
    vertex.renderY + radius * Math.sin(endAngle);

  const largeArcFlag = difference > Math.PI ? 1 : 0;

  const path = `
    M ${startX} ${startY}
    A ${radius} ${radius}
      0 ${largeArcFlag} 1
      ${endX} ${endY}
  `;

  // Position label halfway through the angle
  const midAngle = startAngle + difference / 2;

  const labelRadius = radius + 18;

  const labelX =
    vertex.renderX +
    labelRadius * Math.cos(midAngle) + labelOffsetX;

  const labelY =
    vertex.renderY +
    labelRadius * Math.sin(midAngle) + labelOffsetY;

    useEffect(() => {
    if (angle !== null && !Number.isNaN(angle)) {
      setAngle(label, Number(angle.toFixed(1)));
    }
  }, [label, angle, setAngle]);

  return (
    <g className="pointer-events-none">
      {/* Angle arc */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />

      {/* Vertex */}
      <circle
        cx={vertex.renderX}
        cy={vertex.renderY}
        r={3}
        fill={color}
      />

      {/* Angle value */}
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
        {label} {angle.toFixed(1)}°
      </text>
    </g>
  );
};