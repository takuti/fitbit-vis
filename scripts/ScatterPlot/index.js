import React, { useState, useMemo } from 'react';
import {
  scaleLinear,
  scaleOrdinal,
  extent,
} from 'd3';
import ReactDropdown from 'react-dropdown';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';
import { ColorLegend } from './ColorLegend';

const xAxisOffset = 150;
const yAxisOffset = 320;

const tickOffset = 16;
const fadeOpacity = 0.2;

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

const circleRadius = 4;

export const ScatterPlot = ({
  data,
  filteredData,
  width,
  height,
  margin,
  yValue,
  yAttribute,
  setYAttribute,
  colorThresholdDate
}) => {
  const initialXAttribute = 'asleep';
  const [xAttribute, setXAttribute] = useState(
    initialXAttribute
  );
  const xValue = (d) => d[xAttribute];

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

  const [hoveredValue, setHoveredValue] = useState(null);
  const colorValue = (d) => (d.date <= colorThresholdDate) ? 'Pre-COVID' : 'Post-COVID';
  const colorScale = scaleOrdinal()
    .domain(data.map(colorValue))
    .range(['rgba(196, 91, 161, 0.973)', '#137B80']);
  const filteredDataByColor = filteredData.filter(
    (d) => colorValue(d) === hoveredValue
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
        <g transform={`translate(${innerWidth + 50},40)`}>
          <ColorLegend
            colorScale={colorScale}
            tickSpacing={30}
            tickSize={circleRadius}
            tickTextOffset={20}
            onHover={setHoveredValue}
            hoveredValue={hoveredValue}
            fadeOpacity={fadeOpacity}
          />
        </g>
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
          <g opacity={hoveredValue ? fadeOpacity : 1.0}>
            <Marks
              data={filteredData}
              xScale={xScale}
              yScale={yScale}
              xValue={xValue}
              yValue={yValue}
              circleRadius={circleRadius}
              opacity={0.5}
              colorThresholdDate={colorThresholdDate}
            />
          </g>
          <Marks
            data={filteredDataByColor}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            circleRadius={circleRadius}
            opacity={0.5}
            colorThresholdDate={colorThresholdDate}
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