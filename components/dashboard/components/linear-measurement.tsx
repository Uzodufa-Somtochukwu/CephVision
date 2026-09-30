// import { Point } from "./svg-angle";

// type LinearMeasurementProps = {
//   p1: Point;
//   p2: Point;
//   label: string;
//   pixelsPerMm?: number;
//   color?: string;
// };

// export function LinearMeasurement({
//   p1,
//   p2,
//   label,
//   pixelsPerMm,
//   color = "#facc15",
// }: LinearMeasurementProps) {
//   const dx = p2.renderX - p1.renderX;
//   const dy = p2.renderY - p1.renderY;

//   const pixelDistance = Math.hypot(dx, dy);

//   if (!pixelDistance) {
//     return null;
//   }

//   const distance = pixelDistance ;

//   // Midpoint
//   const midX = (p1.renderX + p2.renderX) / 2;
//   const midY = (p1.renderY + p2.renderY) / 2;

//   // Perpendicular offset for the label
//   const offset = 15;

//   const normalX = -dy / pixelDistance;
//   const normalY = dx / pixelDistance;

//   const labelX = midX + normalX * offset;
//   const labelY = midY + normalY * offset;

//   return (
//     <g className="pointer-events-none">
//       {/* Measurement line */}
//       <line
//         x1={p1.renderX}
//         y1={p1.renderY}
//         x2={p2.renderX}
//         y2={p2.renderY}
//         stroke={color}
//         strokeWidth={2}
//         strokeDasharray="6 3"
//       />

//       {/* Endpoint markers */}
//       <circle
//         cx={p1.renderX}
//         cy={p1.renderY}
//         r={3}
//         fill={color}
//       />

//       <circle
//         cx={p2.renderX}
//         cy={p2.renderY}
//         r={3}
//         fill={color}
//       />

//       {/* Measurement label */}
//       <text
//         x={labelX}
//         y={labelY}
//         fill={color}
//         fontSize={12}
//         fontWeight="700"
//         textAnchor="middle"
//         dominantBaseline="middle"
//         style={{
//           paintOrder: "stroke",
//           stroke: "#000",
//           strokeWidth: 3,
//         }}
//       >
//         {label} {distance.toFixed(1)} mm
//       </text>
//     </g>
//   );
// }

import { Point } from "./svg-angle";

type LinearMeasurementProps = {
  /**
   * The point being measured.
   * For point-to-point: this is p1.
   * For point-to-line: this is the point being measured.
   */
  p1: Point;

  /**
   * For point-to-point:
   *   p2 = second point
   *
   * For point-to-line:
   *   p2 and lineEnd define the reference line.
   */
  p2: Point;

  /**
   * Required only for point-to-line measurements.
   *
   * Example:
   * p1 = upperLip
   * p2 = softPog
   * lineEnd = pronasale
   */
  lineEnd?: Point;

  label: string;

  pixelsPerMm?: number;

  color?: string;

  /**
   * Default = "point-to-point"
   */
  mode?: "point-to-point" | "point-to-line";
  offsetLabel?:number;

  /**
   * Whether to show the reference line when using point-to-line.
   */
  showReferenceLine?: boolean;
  imgDetails?:{height:number; width:number}
};

export function LinearMeasurement({
  p1,
  p2,
  lineEnd,
  label,
  pixelsPerMm = 1,
  color = "#facc15",
  mode = "point-to-point",
  showReferenceLine = false,
  imgDetails,
  offsetLabel = 15
}: LinearMeasurementProps) {
  /*
   * ============================================================
   * POINT → POINT
   * ============================================================
   */

  if (mode === "point-to-point") {
    const dx = p2.renderX - p1.renderX;
    const dy = p2.renderY - p1.renderY;

   

    const pixelDistance = Math.hypot(dx, dy);

    if (!pixelDistance) {
      return null;
    }

    //  const printedImageLength = 190  //mm
    //  const appImageHeight = imgDetails?.height as number //px
    
    // const distanceOfPointFromApp = pixelDistance // px
    // const distance = distanceOfPointFromApp * ( printedImageLength / appImageHeight)   //mm

     const distance = pixelDistance/6;



    // Midpoint
    const midX = (p1.renderX + p2.renderX) / 2;
    const midY = (p1.renderY + p2.renderY) / 2;

    // Perpendicular offset for label
    const offset = offsetLabel;

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

  /*
   * ============================================================
   * POINT → LINE
   * ============================================================
   */

  if (!lineEnd) {
    return null;
  }

  const lineStartX = p2.renderX;
  const lineStartY = p2.renderY;

  const lineEndX = lineEnd.renderX;
  const lineEndY = lineEnd.renderY;

  const lineDX = lineEndX - lineStartX;
  const lineDY = lineEndY - lineStartY;

  const lineLengthSquared =
    lineDX * lineDX + lineDY * lineDY;

  if (!lineLengthSquared) {
    return null;
  }

  /*
   * Find the perpendicular projection of p1
   * onto the reference line p2 → lineEnd.
   *
   * This is the point where the perpendicular
   * measurement meets the reference line.
   */
  const t =
    ((p1.renderX - lineStartX) * lineDX +
      (p1.renderY - lineStartY) * lineDY) /
    lineLengthSquared;

  const projectionX = lineStartX + t * lineDX;
  const projectionY = lineStartY + t * lineDY;

  /*
   * Distance from measured point to reference line.
   */
  const measurementDX = projectionX - p1.renderX;
  const measurementDY = projectionY - p1.renderY;


  const pixelDistance = measurementDY
  
  // diagonal distance from one point to another
// const pixelDistance = Math.hypot(
//     measurementDX,
//     measurementDY
//   );
  

  if (!pixelDistance) {
    return null;
  }

    //    const printedImageLength = 190  //mm
    //  const appImageHeight = imgDetails?.height as number //px
   
    // const distanceOfPointFromApp = pixelDistance // px
    // const distance = distanceOfPointFromApp * ( printedImageLength / appImageHeight)   //mm

   const distance = pixelDistance /6


  /*
   * Midpoint of the perpendicular measurement.
   */
  const midX =
    (p1.renderX + projectionX) / 2;

  const midY =
    (p1.renderY + projectionY) / 2;

  /*
   * Offset label away from the measurement line.
   */
  const offset = offsetLabel;

  const normalX =
    -measurementDY / pixelDistance;

  const normalY =
    measurementDX / pixelDistance;

  const labelX = midX + normalX * offset;
  const labelY = midY + normalY * offset;

  return (
    <g className="pointer-events-none">

      {/* =====================================================
          Optional reference line
          ===================================================== */}
      {showReferenceLine && (
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={lineEndX}
          y2={lineEndY}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.5}
        />
      )}

      {/* =====================================================
          Perpendicular measurement
          ===================================================== */}
      <line
        x1={p1.renderX}
        y1={p1.renderY}
        x2={projectionX}
        y2={projectionY}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 3"
      />

      {/* =====================================================
          Measured point
          ===================================================== */}
      <circle
        cx={p1.renderX}
        cy={p1.renderY}
        r={3}
        fill={color}
      />

      {/* =====================================================
          Projection point on reference line
          ===================================================== */}
      <circle
        cx={projectionX}
        cy={projectionY}
        r={3}
        fill={color}
      />

      {/* =====================================================
          Measurement label
          ===================================================== */}
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