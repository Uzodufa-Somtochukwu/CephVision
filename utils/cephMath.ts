export interface Point {
  x: number;
  y: number;
}

export interface Landmark {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

/**
 * Parses raw coordinate input into a structured Landmark object.
 * Example: parseRawLandmark("Cephalogram", 434, 430, "C")
 */
export function parseRawLandmark(
  name: string,
  x: number,
  y: number,
  label: string = 'Pt',
  color: string = '#38bdf8'
): Landmark {
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name,
    label,
    x,
    y,
    color,
  };
}

/**
 * Normalizes an array of raw tuples/objects into structured Landmark objects.
 */
export function normalizeLandmarks(
  rawList: Array<{ name: string; x: number; y: number; label?: string }>
): Landmark[] {
  return rawList.map((item) =>
    parseRawLandmark(
      item.name,
      item.x,
      item.y,
      item.label || item.name.substring(0, 2).toUpperCase()
    )
  );
}

/**
 * Calculates the internal angle formed by three points (Vertex at B: Angle A-B-C)
 * Returns value in degrees rounded to 1 decimal place.
 */
export function calculateAngle(p1: Point, vertex: Point, p2: Point): number {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };

  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosTheta = Math.max(-1, Math.min(1, dotProduct / (mag1 * mag2)));
  const angleRad = Math.acos(cosTheta);

  return Math.round(((angleRad * 180) / Math.PI) * 10) / 10;
}

/**
 * Calculates the intersection angle between two lines (Line1: p1->p2, Line2: p3->p4)
 * Useful for Mandibular Plane Angle relative to Cranial Base (SN to Go-Me).
 */
export function calculateLineIntersectionAngle(
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): number {
  const angle1 = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
  const angle2 = Math.atan2(line2End.y - line2Start.y, line2End.x - line2Start.x);

  let diff = Math.abs(angle1 - angle2) * (180 / Math.PI);
  if (diff > 90) diff = 180 - diff;

  return Math.round(diff * 10) / 10;
}

/**
 * Evaluates Skeletal Class based on ANB angle
 */
export function evaluateSkeletalClass(anb: number): string {
  if (anb >= 0 && anb <= 4) return 'Skeletal Class I (Normal)';
  if (anb > 4) return 'Skeletal Class II (Maxillary Retrognathism / Mandibular Retrusion)';
  return 'Skeletal Class III (Mandibular Prognathism)';
}