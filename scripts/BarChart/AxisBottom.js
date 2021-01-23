export const AxisBottom = ({ 
  xScale, 
  innerHeight, 
  tickFormat, 
  tickOffset,
  barWidth,
}) =>
  xScale.domain().map(tickValue => {
    const tickBaseX = xScale(tickValue) + xScale.bandwidth() / 2;
    const tickBaseY = innerHeight + tickOffset;
    return (
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
          x={tickBaseX}
          y={tickBaseY} 
          transform={`translate(
            -${innerHeight},
            ${tickBaseX + tickBaseY}
          ) rotate(-90)`}
        >
          {tickFormat(tickValue)}
        </text>
      </g>
    );
  });
