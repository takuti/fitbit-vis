import React from 'react';
import ReactDOM from 'react-dom';
import {
  scaleLinear,
  max,
  timeFormat,
  scaleBand
} from 'd3';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const width = 960;
const height = 500;
const margin = {
  top: 50,
  right: 30,
  bottom: 150,
  left: 100,
};
const barWidth = 8;

const xValue = (d) => d.dateTime;
const xAxisLabel = 'Date';
const xAxisLabelOffset = 100;
const xAxisTickFormat = timeFormat('%m/%d/%Y');

const yValue = (d) => d.value;
const yAxisLabel = 'Steps';
const yAxisLabelOffset = 60;

const App = () => {
  const data = useData('https://api.fitbit.com/1/user/-/activities/steps/date/today/1m.json');

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .paddingInner(0.15);

  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0]);

  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(${margin.left},${margin.top})`}
      >
        <text
          className="chart-title"
          x={innerWidth / 2}
          y={-20}
          textAnchor="middle"
        >
          Fitbit Daily Steps
        </text>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
          tickOffset={5}
          barWidth={barWidth}
        />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>
        <AxisLeft
          yScale={yScale}
          innerWidth={innerWidth}
          tickOffset={5}
        />
        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset},${
            innerHeight / 2
          }) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <Marks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          innerHeight={innerHeight}
          barWidth={barWidth}
        />
      </g>
    </svg>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);