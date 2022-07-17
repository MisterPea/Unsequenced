import * as React from 'react';
import { SvgXml } from 'react-native-svg';

function TaskBlockIcon({ size = 30, color = '#000000' }:{size:number, color:string}) {
  const xml:string = `<svg
  xmlns='http://www.w3.org/2000/svg'
  width='${size}'
  height='${size}'
  viewBox='0 0 33 33'
>
  <path fill='none' d='M0 0h24v24H0V0z'></path>
  <path fill='${color}' d='M18 4v5H6V4h12m0-2H6c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 13v5H6v-5h12m0-2H6c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z'></path>
</svg>`;

  return (
    <SvgXml xml={xml} />
  );
}

export default TaskBlockIcon;
