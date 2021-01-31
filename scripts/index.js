import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useActivities } from './useActivities';
import { useSleep } from './useSleep';
import { BarChart } from './BarChart/index.js'
import { ScatterPlot } from './ScatterPlot/index.js';

const width = 960;
const height = 400;
const margin = {
  top: 20,
  right: 20,
  bottom: 120,
  left: 150,
};
const xValue = (d) => d.date;

const App = () => {
  const activities = useActivities();
  const sleep = useSleep();
  const [brushExtent, setBrushExtent] = useState();

  const initialYAttribute = 'steps';
  const [yAttribute, setYAttribute] = useState(
    initialYAttribute
  );
  const yValue = (d) => d[yAttribute];

  if (!activities || !sleep) {
    return <pre>Loading...</pre>;
  }

  const activitiesMap = new Map();
  for (let i = 0; i < activities.length; i++) {
    activitiesMap.set(activities[i].Date, activities[i]);
  }

  const sleepMap = new Map();
  for (let i = 0; i < sleep.length; i++) {
    sleepMap.set(sleep[i].key, sleep[i]);
  }

  const data = new Map();
  Array.from(activitiesMap.keys())
    .filter((k) => sleepMap.has(k))
    .forEach((k) => {
      data.set(k, activitiesMap.get(k));
      data.set(k, Object.assign(data.get(k), sleepMap.get(k)));
    });

  const dataArray = Array.from(data.values());
  const filteredData = brushExtent
    ? dataArray.filter((d) => {
        const date = xValue(d);
        return (
          brushExtent[0] < date && date < brushExtent[1]
        );
      })
    : dataArray;

  return (
    <>
      <h1 className="chart-title">
        Fitbit Activity/Sleep Explorer
      </h1>
      <ScatterPlot 
        data={filteredData}
        width={width}
        height={height}
        margin={margin}
        yValue={yValue}
        yAttribute={yAttribute}
        setYAttribute={setYAttribute}
      />
      <BarChart 
        data={dataArray}
        width={width}
        height={height / 1.5}
        margin={margin}
        xValue={xValue}
        yValue={yValue}
        setBrushExtent={setBrushExtent}
      />
    </>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);