'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const [userinput, setuserinput] = useState([]);

  const [bomlist, setbomlist] = useState([]);

  const [sampleCounter, setsampleCounter] = useState(0);

  const sampleclickHandler = () => {
    setsampleCounter((sampleCounter + 1) % 14);
  };

  const clickHandler = (y: number, x: number) => {};

  const bomchecker = (input: number[], bomd: number[], size: number[]) => {};

  return (
    <div className={styles.container}>
      <button
        onClick={() => sampleclickHandler()}
        className={styles.sampleCell}
        style={{ backgroundPosition: `${-30 * sampleCounter}px` }}
      />
    </div>
  );
}
