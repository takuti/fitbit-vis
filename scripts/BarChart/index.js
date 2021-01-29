import React from 'react';
import {
  scaleLinear,
  max,
  timeFormat,
  scaleTime,
  extent
} from 'd3';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const barWidth = 2;
const xAxisLabelOffset = 100;

export const BarChart = ({
  data,
  width,
  height,
  margin,
  yValue,
}) => {
  const xValue = (d) => d.date;
  const xAxisLabel = 'Date';
  const xAxisTickFormat = timeFormat('%m/%d/%Y');

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0])
    .nice();

  return (
    <>
      <svg width={width} height={height}>
        <g
          transform={`translate(${margin.left},${margin.top})`}
        >
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
    </>
  );
};