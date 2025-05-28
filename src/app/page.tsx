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
  const clickHandler = (y: number, x: number) => {
    console.log(y, x);
  };

  const bomchecker = (input: number[], bomd: number[], size: number[]) => {};

  const board = (size: number[]) => {
    const calcboard: number[][] = Array.from({ length: size[0] }, () =>
      new Array<number>(size[1]).fill(-1),
    );
    return calcboard;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.board}
        style={{ width: `${boardsize[0] * 30}px`, height: `${boardsize[1] * 30}` }}
      >
        {board(boardsize).map((row, y) =>
          row.map((i, x) => (
            <button
              key={'${y}-${x}'}
              onClick={() => clickHandler(y, x)}
              className={styles.sampleCell}
              style={{ backgroundPosition: `${-30 * i}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
