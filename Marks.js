export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  innerHeight,
  barWidth
}) =>
  data.map(d => (
    <rect
      className="mark"
      x={xScale(xValue(d))}
      y={yScale(yValue(d))}
      width={barWidth}
      height={innerHeight - yScale(yValue(d))}
    >
      <title>{yValue(d)}</title>
    </rect>
  ));