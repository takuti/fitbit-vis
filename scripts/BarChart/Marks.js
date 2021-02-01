export const Marks = ({
  data,
  xScale,
  yScale,
  innerHeight,
  colorThresholdDate
}) =>
  data.map(d => (
    <rect
      className={d.x0 <= colorThresholdDate ? "mark-green" : "mark-red"}
      x={xScale(d.x0)}
      y={yScale(d.y)}
      width={xScale(d.x1) - xScale(d.x0)}
      height={innerHeight - yScale(d.y)}
    >
      <title>{d.y}</title>
    </rect>
  ));