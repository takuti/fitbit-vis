import {
  useState,
  useEffect,
} from 'react';
import { json } from 'd3';

const token = '';

export const useData = (endpoint) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(endpoint, {
      headers: new Headers({ 'Authorization': `Bearer ${token}` })
    }).then((data) => {
      data['activities-steps'].forEach(d => {
        d.dateTime = new Date(d.dateTime);
        d.value = +d.value;
      });
      setData(data['activities-steps']);
    });
  }, []);

  return data;
};