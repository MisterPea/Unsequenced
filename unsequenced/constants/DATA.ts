import { TaskBlock } from './types';

const DATA: TaskBlock[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Window shopping',
    breaks: false,
    autoplay: false,
    tasks: [],
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Development Tasks',
    breaks: false,
    autoplay: true,
    tasks: [
      {
        id: 'taskOne',
        title: 'Work on React.js app',
        amount: 50,
        completed: 0,
      },
      {
        id: 'taskTwo',
        title: 'Take a cat-nap',
        amount: 90,
        completed: 10,

      },
      {
        id: 'taskThree',
        title: 'Write Tests',
        amount: 60,
        completed: 59,
      },
    ],
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Default pomodoro',
    breaks: false,
    autoplay: false,
    tasks: [
      {
        id: 'taskOne',
        title: 'Active',
        amount: 25,
        completed: 0,
      },
      {
        id: 'taskTwo',
        title: 'Rest',
        amount: 5,
        completed: 0,
      },
      {
        id: 'taskThree',
        title: 'Active',
        amount: 25,
        completed: 0,
      },
    ],
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd11aa11f11',
    title: 'Development Tasks',
    breaks: true,
    autoplay: true,
    tasks: [
      {
        id: 'taskOne',
        title: 'Work on React.js app',
        amount: 50,
        completed: 0,
      },
      {
        id: 'taskTwo',
        title: 'Take a cat-nap',
        amount: 90,
        completed: 10,
      },
      {
        id: 'break0gfrxqjyj2v',
        title: '10 minute break.',
        amount: 10,
        completed: 0,
        break: true,
      },
      {
        id: 'taskThree',
        title: 'Write Tests',
        amount: 60,
        completed: 59,
      },
    ],
  },
];

export default DATA;
