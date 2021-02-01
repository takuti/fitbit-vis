import {
  useState,
  useEffect
} from 'react';
import { csv } from 'd3';

const activitiesUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/activities.csv';
const parseActivitiesRow = (d) => ({
  key: d.Date, // YYYY-MM-DD
  date: new Date(d.Date),
  steps: +d['Steps'].replace(',', ''),
  calories: +d['Activity Calories'].replace(',', ''),
  distance: +d['Distance'],
  floors: +d['Floors'],
  fairlyActive: +d['Minutes Fairly Active'],
  lightlyActive: +d['Minutes Lightly Active'],
  sedentary: +d['Minutes Sedentary'].replace(',', ''),
  veryActive: +d['Minutes Very Active'],
});

const sleepUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/sleep.csv';
const parseSleepRow = (d) => {
  const dateStr = d['Start Time'].substring(0, 10); // YYYY-MM-DD
  return {
    key: dateStr,
    date: new Date(dateStr),
    asleep: +d['Minutes Asleep'],
    awake: +d['Minutes Awake'],
    awakenings: +d['Number of Awakenings'],
    duration: +d['Time in Bed'],
    rem: +d['Minutes REM Sleep'],
    light: +d['Minutes Light Sleep'],
    deep: +d['Minutes Deep Sleep'],
  };
};

// https://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i/17500836#17500836
const innerJoin = (t1, t2, key1, key2, selectFunc) => {
  const lookup = t1.reduce((lookup, row1) => lookup.set(row1[key1], row1), new Map);
  return t2
    .filter(row2 => lookup.get(row2[key2]))
    .map(row2 => selectFunc(lookup.get(row2[key2]), row2));
};

// aggregate array of hash over a certain key
const aggregate = (t, key, aggFunc) => {
  const aggMap = t.reduce(
    (aggMap, row) => 
      aggMap.set(
        row[key], 
        aggMap.has(row[key]) 
          ? aggFunc(row, aggMap.get(row[key])) 
          : row
      ),
    new Map
  );
  return Array.from(aggMap.values());
};

export const useData = () => {
  const [data, setData] = useState();

  useEffect(() => {
    Promise.all([
      csv(activitiesUrl, parseActivitiesRow),
      csv(sleepUrl, parseSleepRow)
    ]).then(([activities, sleep]) => {
      const sleeps = aggregate(sleep, 'key', (row, ref) => ({
        key: row.key,
        date: row.date, 
        asleep: row.asleep + ref.asleep, 
        awake: row.awake + ref.awake, 
        awakenings: row.awakenings + ref.awakenings, 
        duration: row.duration + ref.duration,
        rem: row.rem + ref.rem,
        light: row.light + ref.light,
        deep: row.deep + ref.deep
      }));
      
      const data = innerJoin(activities, sleeps, 'key', 'key', (
          {date, steps, calories, distance, floors, fairlyActive, lightlyActive, sedentary, veryActive}, 
          {asleep, awake, awakenings, duration, rem, light, deep}
        ) => ({
          date, steps, calories, distance, floors, fairlyActive, lightlyActive, sedentary, veryActive,
          asleep, awake, awakenings, duration, rem, light, deep
        }));

      setData(data);
    });
  }, []);

  return data;
};