export const AxisBottom = ({ 
  xScale, 
  innerHeight, 
  tickFormat, 
  tickOffset,
}) =>
  xScale.ticks().map(tickValue => (
    <g
      className="tick"
      transform={`translate(${xScale(tickValue)},0)`}
    >
      <text 
        style={{ textAnchor: 'end' }} 
        y={innerHeight + tickOffset} 
        transform={`translate(
          -${innerHeight},
          ${innerHeight + tickOffset}
        ) rotate(-90)`}
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  )
);
