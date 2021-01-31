import {
  useState,
  useEffect
} from 'react';
import { csv } from 'd3';

const activitiesUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/activities.csv';
const parseActivitiesRow = (d) => {
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

const sleepUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/sleep.csv';
const parseSleepRow = (d) => {
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

export const useData = () => {
  const [data, setData] = useState();

  useEffect(() => {
    Promise.all([
      csv(activitiesUrl, parseActivitiesRow),
      csv(sleepUrl, parseSleepRow)
    ]).then(([activities, sleep]) => {
      const aggMap = new Map();
      sleep.forEach(d => {
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
      const sleepArray = Array.from(aggMap.values());

      const activitiesMap = new Map();
      for (let i = 0; i < activities.length; i++) {
        activitiesMap.set(activities[i].Date, activities[i]);
      }

      const sleepMap = new Map();
      for (let i = 0; i < sleepArray.length; i++) {
        sleepMap.set(sleepArray[i].key, sleepArray[i]);
      }

      const data = new Map();
      Array.from(activitiesMap.keys())
        .filter((k) => sleepMap.has(k))
        .forEach((k) => {
          data.set(k, activitiesMap.get(k));
          data.set(k, Object.assign(data.get(k), sleepMap.get(k)));
        });

      setData(Array.from(data.values()));
    });
  }, []);

  return data;
};