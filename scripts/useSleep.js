import {
  useState,
  useEffect,
} from 'react';
import { csv } from 'd3';

const url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/sleep.csv';

const row = (d) => {
  d.key = d['Start Time'].substring(0, 10);  // YYYY-MM-DD
  d.date = new Date(d.key);
  d.asleep = +d['Minutes Asleep'];
  d.awake = +d['Minutes Awake'];
  d.awakenings = +d['Number of Awakenings'];
  d.duration = +d['Time in Bed'];
  d.rem = +d['Minutes REM Sleep'];
  d.light = +d['Minutes Light Sleep'];
  d.deep = +d['Minutes Deep Sleep'];
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
          e.rem += d.rem;
          e.light += d.light;
          e.deep += d.light;
        } else {
          aggMap.set(d.key, {
            key: d.key,
            date: d.date, 
            asleep: d.asleep, 
            awake: d.awake, 
            awakenings: d.awakenings, 
            duration: d.duration,
            rem: d.rem,
            light: d.light,
            deep: d.deep
          });
        }
      });
      return setData(Array.from(aggMap.values()));
    }) 
  }, []);

  return data;
};