export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius,
  opacity
}) =>
  data.map(d => {
    if (isNaN(xValue(d))) return;
    return <circle
      className="mark"
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={circleRadius}
      opacity={opacity}
    />;
  });
