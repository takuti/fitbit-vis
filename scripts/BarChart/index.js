import React, { useState } from 'react';
import {
  scaleLinear,
  max,
  timeFormat,
  scaleTime,
  extent
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const barWidth = 2;
const xAxisLabelOffset = 100;
const yAxisLabelOffset = 75;

const attributes = [
  { value: 'steps', label: 'Steps' },
  { value: 'calories', label: 'Calories Burned' },
  { value: 'distance', label: 'Distance' },
  { value: 'floors', label: 'Floors' },
  { value: 'fairlyActive', label: 'Minutes Fairly Active' },
  { value: 'lightlyActive', label: 'Minutes Lightly Active' },
  { value: 'Sedentary', label: 'Minutes Sedentary' },
  { value: 'veryActive', label: 'Minutes Very Active' }
];

export const BarChart = ({
  data,
  width,
  height,
  margin
}) => {
  const xValue = (d) => d.date;
  const xAxisLabel = 'Date';
  const xAxisTickFormat = timeFormat('%m/%d/%Y');

  const initialYAttribute = 'steps';
  const [yAttribute, setYAttribute] = useState(
    initialYAttribute
  );
  const yValue = (d) => d[yAttribute];

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
      <div 
        className="dropdown-container"
        style={{ 
          position: 'absolute',
          left: -yAxisLabelOffset,
          top: innerHeight * 4.5,
          transform: 'rotate(-90deg)'
        }}
      >
        <ReactDropdown
          options={attributes}
          value={yAttribute}
          onChange={({ value }) => setYAttribute(value)}
        />
      </div>
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