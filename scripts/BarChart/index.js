import React, { useMemo } from 'react';
import {
  scaleLinear,
  max,
  timeFormat,
  scaleTime,
  extent,
  histogram as bin,
  timeWeeks,
  sum
} from 'd3';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

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

  const binnedData = useMemo(() => {
    const [start, stop] = xScale.domain();
    return bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(timeWeeks(start, stop))(data)
      .map((array) => ({
        y: sum(array, yValue),
        x0: array.x0,
        x1: array.x1,
      }));
  }, [xValue, xScale, data, yValue]);

  const yScale = scaleLinear()
    .domain([0, max(binnedData, (d) => d.y)])
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
            data={binnedData}
            xScale={xScale}
            yScale={yScale}
            innerHeight={innerHeight}
          />
        </g>
      </svg>
    </>
  );
};