export const AxisLeft = ({ yScale, innerWidth, tickOffset }) =>
  yScale.ticks().map(tickValue => (
    <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
      <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-tickOffset}
      >
        {tickValue}
      </text>
    </g>
  ));
