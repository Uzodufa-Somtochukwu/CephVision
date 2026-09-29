import { Point } from "./svg-angle";

const projectedPointOntoLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): Point => {
  const dx = lineEnd.renderX - lineStart.renderX;
  const dy = lineEnd.renderY - lineStart.renderY;

  const lengthSquared = dx * dx + dy * dy;

  const t =
    ((point.renderX - lineStart.renderX) * dx +
      (point.renderY - lineStart.renderY) * dy) /
    lengthSquared;

  return {
    renderX: lineStart.renderX + t * dx,
    renderY: lineStart.renderY + t * dy,
  };
};