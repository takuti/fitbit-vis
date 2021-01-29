import {
  useState,
  useEffect,
} from 'react';
import { csv } from 'd3';

const url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/activities.csv';

const row = (d) => {
  d.dateTime = new Date(d.Date);
  d.steps = +d['Steps'].replace(',', '');
  d.calories = +d['Activity Calories'].replace(',', '');
  d.distance = +d['Distance'];
  d.floors = +d['Floors'];
  d.fairlyActive = +d['Minutes Fairly Active'];
  d.lightlyActive = +d['Minutes Lightly Active'];
  d.Sedentary = +d['Minutes Sedentary'].replace(',', '');
  d.veryActive = +d['Minutes Very Active'];
  return d;
};

export const useActivities = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(url, row).then(setData) 
  }, []);

  return data;
};