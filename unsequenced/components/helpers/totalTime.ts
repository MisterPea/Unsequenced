import { Task } from '../../constants/types';

export default function totalTime(tasks:Task[] | number) {
  let timeMinutes;
  if (Array.isArray(tasks)) {
    timeMinutes = tasks.reduce((prev, curr) => prev + curr.amount, 0) || 0;
  } else {
    timeMinutes = tasks;
  }

  if (timeMinutes <= 60) {
    if (timeMinutes === 60) {
      return '1 hour';
    }
    return `${timeMinutes} minutes`;
  }
  return `${Math.floor((timeMinutes / 60) * 10 ** 1) / 10 ** 1} hours`;
}
