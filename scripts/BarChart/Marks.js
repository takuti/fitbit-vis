export const Marks = ({
  data,
  xScale,
  yScale,
  innerHeight,
}) =>
  data.map(d => (
    <rect
      className="mark"
      x={xScale(d.x0)}
      y={yScale(d.y)}
      width={xScale(d.x1) - xScale(d.x0)}
      height={innerHeight - yScale(d.y)}
    >
      <title>{d.y}</title>
    </rect>
  ));