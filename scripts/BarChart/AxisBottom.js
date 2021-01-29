export const AxisBottom = ({ 
  xScale, 
  innerHeight, 
  tickFormat, 
  tickOffset,
  barWidth,
}) =>
  xScale.ticks().map(tickValue => (
    <g
      className="tick"
      transform={`translate(${xScale(tickValue)},0)`}
    >
      <line 
        x1={barWidth / 2} 
        x2={barWidth / 2} 
        y2={innerHeight} 
      />
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
