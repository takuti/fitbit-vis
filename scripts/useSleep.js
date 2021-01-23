import {
  useState,
  useEffect,
} from 'react';
import { csv } from 'd3';

const url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/sleep.csv';

const row = (d) => {
  d.date = new Date(d['End Time'].substring(0, 10));  // YYYY-MM-DD
  d.value = +d['Minutes Asleep'];
  return d;
};

export const useSleep = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(url, row).then(setData) 
  }, []);

  return data;
};