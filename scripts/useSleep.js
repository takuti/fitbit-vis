import {
  useState,
  useEffect,
} from 'react';
import { csv } from 'd3';

const url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/sleep.csv';

const row = (d) => {
  d.key = d['Start Time'].substring(0, 10);  // YYYY-MM-DD
  d.date = new Date(d.key);
  d.asleep = +d['Minutes Asleep'];
  d.awake = +d['Minutes Awake'];
  d.awakenings = +d['Number of Awakenings'];
  d.duration = +d['Time in Bed'];
  return d;
};

export const useSleep = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    csv(url, row).then((data) => {
      const aggMap = new Map();
      data.forEach(d => {
        if (aggMap.has(d.key)) {
          const e = aggMap.get(d.key);
          e.asleep += d.asleep;
          e.awake += d.awake;
          e.awakenings += d.awakenings;
          e.duration += d.duration;
        } else {
          aggMap.set(d.key, {
            key: d.key,
            date: d.date, 
            asleep: d.asleep, 
            awake: d.awake, 
            awakenings: d.awakenings, 
            duration: d.duration
          });
        }
      });
      return setData(Array.from(aggMap.values()));
    }) 
  }, []);

  return data;
};