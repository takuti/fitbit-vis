export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius,
  opacity,
  colorThresholdDate
}) =>
  data.map(d => {
    if (isNaN(xValue(d))) return;
    return <circle
      className={d.date <= colorThresholdDate ? "mark-green" : "mark-red"}
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={circleRadius}
      opacity={opacity}
    />;
  });
