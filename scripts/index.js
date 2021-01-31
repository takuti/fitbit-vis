import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BarChart } from './BarChart/index.js'
import { ScatterPlot } from './ScatterPlot/index.js';
import { useData } from './useData';

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
  const data = useData();
  const [brushExtent, setBrushExtent] = useState();

  const initialYAttribute = 'steps';
  const [yAttribute, setYAttribute] = useState(
    initialYAttribute
  );
  const yValue = (d) => d[yAttribute];

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const filteredData = brushExtent
    ? data.filter((d) => {
        const date = xValue(d);
        return (
          brushExtent[0] < date && date < brushExtent[1]
        );
      })
    : data;

  return (
    <>
      <h1 className="chart-title">
        Fitbit Activity/Sleep Explorer
      </h1>
      <ScatterPlot 
        data={data}
        filteredData={filteredData}
        width={width}
        height={height}
        margin={margin}
        yValue={yValue}
        yAttribute={yAttribute}
        setYAttribute={setYAttribute}
      />
      <BarChart 
        data={data}
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