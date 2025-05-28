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

  const [bombsmap, setbombsmap] = useState([]);

  const [calctime, settime] = useState([]);

  const [level, setlevel] = useState();

  const [boardsize, setboardsize] = useState([9, 9]);

  const [bombs_number, setnumber] = useState([]);

  const [sampleCounter, setsampleCounter] = useState(0);

  const sampleclickHandler = () => {
    setsampleCounter((sampleCounter + 1) % 15);
  };
  const clickHandler = (y: number, x: number) => {};

  const bomchecker = (input: number[], bomd: number[], size: number[]) => {};

  const setboard = () => {
    const calcboard: number[][] = Array.from({ length: boardsize[0] }, () =>
      new Array<number>(boardsize[1]).fill(-1),
    );
    return calcboard;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.board}
        style={{ width: `${boardsize[0] * 30}px`, height: `${boardsize[1] * 30}` }}
      >
        {setboard().map((row, x) =>
          row.map((i, y) => (
            <button
              key={'${x}-${y}'}
              onClick={() => sampleclickHandler()}
              className={styles.sampleCell}
              style={{ backgroundPosition: `${-30 * i}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
