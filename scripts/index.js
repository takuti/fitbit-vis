import React from 'react';
import ReactDOM from 'react-dom';
import { useActivities } from './useActivities';
import { useSleep } from './useSleep';
import { ScatterPlot } from './ScatterPlot/index.js';

const width = 960;
const height = 500;

const App = () => {
  const activities = useActivities();
  const sleep = useSleep();

  if (!activities || !sleep) {
    return <pre>Loading...</pre>;
  }

  const data = new Map();
  for (let i = 0; i < activities.length; i++) {
    let e = data.get(activities[i].Date);
    if (e) {
      data.set(activities[i].Date, Object.assign(e, activities[i]));
    } else {
      data.set(activities[i].Date, activities[i]);
    }

    e = data.get(sleep[i].key);
    if (e) {
      data.set(sleep[i].key, Object.assign(e, sleep[i]));
    } else {
      data.set(sleep[i].key, sleep[i]);
    }
  }
  return (
    <ScatterPlot 
      data={Array.from(data.values())}
      width={width}
      height={height - 80}
    />
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);