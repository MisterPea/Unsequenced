import { TaskBlock } from './types';

const DATA:TaskBlock[] = [
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
    autoplay: false,
    tasks: [
      {
        id: 'taskOne',
        title: 'Work on React.js app',
        amount: 50,
        isBreak: false,
      },
      {
        id: 'taskTwo',
        title: 'Take a cat-nap',
        amount: 90,
        isBreak: true,
      },
      {
        id: 'taskThree',
        title: 'Write Tests',
        amount: 60,
        isBreak: false,
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
        isBreak: false,
      },
      {
        id: 'taskTwo',
        title: 'Rest',
        amount: 5,
        isBreak: true,
      },
      {
        id: 'taskThree',
        title: 'Active',
        amount: 25,
        isBreak: false,
      },
    ],
  },
];

export default DATA;
