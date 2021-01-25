import React, { useState } from 'react';
import {
  scaleLinear,
  extent,
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const margin = {
  top: 20,
  right: 20,
  bottom: 80,
  left: 150,
};
const xAxisOffset = 60;
const yAxisOffset = 100;

const tickOffset = 16;

const attributes = {
  x: [
    { value: 'asleep', label: 'Minutes Asleep' },
    { value: 'awake', label: 'Minutes Awake' },
    { value: 'awakenings', label: 'Number of Awakenings' },
    { value: 'duration', label: 'Time in Bed' }
  ],
  y: [
    { value: 'steps', label: 'Steps' },
    { value: 'calories', label: 'Calories Burned' },
    { value: 'distance', label: 'Distance' },
    { value: 'floors', label: 'Floors' }
  ]
};

const xDropdownLabel = 'Sleep Metric';
const yDropdownLabel = 'Activitiy Metric';
const getLabel = (axis, attribute) => {
  for (let i = 0; i < attributes[axis].length; i++) {
    if (attributes[axis][i].value === attribute) {
      return attributes[axis][i].label;
    }
  }
};

export const ScatterPlot = ({
  data,
  width,
  height
}) => {
  const initialXAttribute = 'asleep';
  const [xAttribute, setXAttribute] = useState(
    initialXAttribute
  );
  const xValue = (d) => d[xAttribute];
  const xAxisLabel = getLabel('x', xAttribute);

  const initialYAttribute = 'steps';
  const [yAttribute, setYAttribute] = useState(
    initialYAttribute
  );
  const yValue = (d) => d[yAttribute];
  const yAxisLabel = getLabel('y', yAttribute);

  const circleRadius = 7;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  return (
    <>
      <div className="menus-container">
        <span className="dropdown-label">X ({xDropdownLabel}) </span>
        <ReactDropdown
          options={attributes['x']}
          value={xAttribute}
          onChange={({ value }) => setXAttribute(value)}
        />
        <span className="dropdown-label">Y ({yDropdownLabel})</span>
        <ReactDropdown
          options={attributes['y']}
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
            tickOffset={tickOffset}
          />
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <AxisLeft
            yScale={yScale}
            innerWidth={innerWidth}
            tickOffset={tickOffset}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisOffset},${
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
            circleRadius={circleRadius}
          />
        </g>
      </svg>
    </>
  );
};