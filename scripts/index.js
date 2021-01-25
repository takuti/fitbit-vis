import React from 'react';
import ReactDOM from 'react-dom';
import { useActivities } from './useActivities';
import { useSleep } from './useSleep';
import { BarChart } from './BarChart/index.js';
import { ScatterPlot } from './ScatterPlot/index.js';

const width = 960;
const height = 500;

const App = () => {
  const activities = useActivities();
  const sleep = useSleep();

  if (!activities || !sleep) {
    return <pre>Loading...</pre>;
  }

  return (
    <>
     {/* <BarChart 
      data={activities}
      width={width}
      height={height}
     /> */}
      <ScatterPlot 
        data={sleep}
        width={width}
        height={height - 80}
      />
    </>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);