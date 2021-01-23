import React from 'react';
import ReactDOM from 'react-dom';
import { useActivities } from './useActivities';
import { BarChart } from './BarChart/index.js';

const width = 960;
const height = 500;

const App = () => {
  const activities = useActivities('https://api.fitbit.com/1/user/-/activities/steps/date/today/1m.json');

  if (!activities) {
    return <pre>Loading...</pre>;
  }

  return (
    <svg width={width} height={height}>
     <BarChart 
      data={activities}
      width={width}
      height={height}
     />
    </svg>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);