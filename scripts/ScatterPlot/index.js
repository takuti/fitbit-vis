import React, { useState, useMemo } from 'react';
import {
  scaleLinear,
  extent,
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const xAxisOffset = 150;
const yAxisOffset = 320;

const tickOffset = 16;

const attributes = {
  x: [
    { value: 'asleep', label: 'Minutes Asleep' },
    { value: 'awake', label: 'Minutes Awake' },
    { value: 'awakenings', label: 'Number of Awakenings' },
    { value: 'duration', label: 'Time in Bed' },
    { value: 'rem', label: 'Minutes REM Sleep' },
    { value: 'light', label: 'Minutes Light Sleep' },
    { value: 'deep', label: 'Minutes Deep Sleep' }
  ],
  y: [
    { value: 'steps', label: 'Steps' },
    { value: 'calories', label: 'Activity Calories' },
    { value: 'distance', label: 'Distance' },
    { value: 'floors', label: 'Floors' },
    { value: 'fairlyActive', label: 'Minutes Fairly Active' },
    { value: 'lightlyActive', label: 'Minutes Lightly Active' },
    { value: 'sedentary', label: 'Minutes Sedentary' },
    { value: 'veryActive', label: 'Minutes Very Active' }
  ]
};

export const ScatterPlot = ({
  data,
  filteredData,
  width,
  height,
  margin,
  yValue,
  yAttribute,
  setYAttribute
}) => {
  const initialXAttribute = 'asleep';
  const [xAttribute, setXAttribute] = useState(
    initialXAttribute
  );
  const xValue = (d) => d[xAttribute];

  const circleRadius = 4;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = useMemo(
    () =>
      scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice(),
    [data, xValue, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
      .domain(extent(data, yValue))
      .range([innerHeight, 0])
      .nice(),
    [data, yValue, innerHeight]
  );

  return (
    <>
      <div 
        className="dropdown-container"
        style={{ 
          position: 'absolute',
          left: -innerWidth / 2 + yAxisOffset,
          top: innerHeight / 1.3,
          transform: 'rotate(-90deg)'
        }}
      >
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
          <AxisLeft
            yScale={yScale}
            innerWidth={innerWidth}
            tickOffset={tickOffset}
          />
          <Marks
            data={filteredData}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            circleRadius={circleRadius}
            opacity={0.5}
          />
        </g>
      </svg>
      <div 
        className="dropdown-container"
        style={{ 
          position: 'absolute', 
          left: innerWidth / 2, 
          top: innerHeight + xAxisOffset 
        }}
      >
        <ReactDropdown
          options={attributes['x']}
          value={xAttribute}
          onChange={({ value }) => setXAttribute(value)}
        />
      </div>
    </>
  );
};