import { useState, useEffect, useRef } from 'react';

export default function introOverlay() {
  // const elements = useRef<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  useEffect(() => {
    console.log(elements[0]);
  }, [elements]);

  return [setElements];
}
