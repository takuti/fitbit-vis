import {
  useState,
  useEffect,
} from 'react';
import { csv } from 'd3';

const url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/activities.csv';

const row = (d) => {
  d.dateTime = new Date(d.Date);
  d.steps = +d['Steps'].replace(',', '');
  d.calories = +d['Calories Burned'].replace(',', '');
  d.distance = +d['Distance'];
  d.floors = +d['Floors'];
  return d;
};

export const useActivities = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(url, row).then(setData) 
  }, []);

  return data;
};