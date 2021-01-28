import React from 'react';
import ReactDOM from 'react-dom';
import { useActivities } from './useActivities';
import { useSleep } from './useSleep';
import { BarChart } from './BarChart/index.js'
import { ScatterPlot } from './ScatterPlot/index.js';

const width = 960;
const height = 500;

const App = () => {
  const activities = useActivities();
  const sleep = useSleep();

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

  return (
    <>
      <h1 className="chart-title" align="center">
        Fitbit Activity/Sleep Correlation Explorer
      </h1>
      <BarChart 
        data={Array.from(data.values())}
        width={width}
        height={height}
      />
      <ScatterPlot 
        data={Array.from(data.values())}
        width={width}
        height={height - 80}
      />
    </>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);