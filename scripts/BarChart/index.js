import React, { useRef, useEffect, useMemo } from 'react';
import {
  scaleLinear,
  max,
  timeFormat,
  scaleTime,
  extent,
  histogram as bin,
  timeWeeks,
  sum,
  event,
  brushX,
  select
} from 'd3';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const xAxisLabel = 'Date';
const xAxisTickFormat = timeFormat('%m/%d/%Y');
const xAxisLabelOffset = 100;

const yAxisLabel = 'Weekly Total';
const yAxisLabelOffset = 100;

export const BarChart = ({
  data,
  width,
  height,
  margin,
  xValue,
  yValue,
  setBrushExtent,
  colorThresholdDate
}) => {
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(data, xValue))
        .range([0, innerWidth])
        .nice(),
    [data, xValue, innerWidth]
  );

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

  const yScale = useMemo(
    () =>
      scaleLinear()
      .domain([0, max(binnedData, (d) => d.y)])
      .range([innerHeight, 0])
      .nice(),
    [binnedData, innerHeight]
  );

  const brushRef = useRef();
  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush(select(brushRef.current));
    brush.on('brush end', () => {
      setBrushExtent(
        event.selection &&
          event.selection.map(xScale.invert)
      );
    });
  });

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
            data={binnedData}
            xScale={xScale}
            yScale={yScale}
            innerHeight={innerHeight}
            colorThresholdDate={colorThresholdDate}
          />
          <g ref={brushRef}></g>
        </g>
      </svg>
    </>
  );
};