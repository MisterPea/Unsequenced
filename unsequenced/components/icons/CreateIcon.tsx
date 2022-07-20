import * as React from 'react';
import { SvgXml } from 'react-native-svg';

function SettingsIcon({ size = 30, color = '#000000' }:{size:number, color:string}) {
  const xml:string = `<svg
  xmlns='http://www.w3.org/2000/svg'
  width='${size}'
  height='${size}'
  viewBox='0 0 33 33'
  >
  <path fill="none" d="M0 0h24v24H0V0z"></path>
  <path fill='${color}' d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41z"></path>
</svg>`;

  return (
    <SvgXml xml={xml} />
  );
}

export default SettingsIcon;
