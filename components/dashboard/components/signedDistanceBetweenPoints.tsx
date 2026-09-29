import { Point } from "./svg-angle";

export const signedDistancePointToLine = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
) => {
  const dx = lineEnd.renderX - lineStart.renderX;
  const dy = lineEnd.renderY - lineStart.renderY;

  const numerator =
    dy * point.renderX -
    dx * point.renderY +
    lineEnd.renderX * lineStart.renderY -
    lineEnd.renderY * lineStart.renderX;

  const denominator = Math.sqrt(dx * dx + dy * dy);

  return numerator / denominator;
};