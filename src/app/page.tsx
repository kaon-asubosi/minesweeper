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

  const [userInput, setUserInput] = useState<number[][]>([]);

  const [bombsMap, setBombsMap] = useState([]);

  const [calcTime, setTime] = useState([]);

  const [level, setLevel] = useState();

  const [boardSize, setBoardSize] = useState([9, 9]);

  const [bombsNumber, setBombsNumber] = useState([]);

  const [sampleCounter, setSampleCounter] = useState(0);

  const sampleClickHandler = () => {
    setSampleCounter((sampleCounter + 1) % 15);
  };

  const setInputList = () => {
    ///インプットリストをボードサイズに基づいて決定する
    const inputList: number[][] = Array.from({ length: boardSize[0] }, () =>
      new Array<number>(boardSize[1]).fill(0),
    );
    setUserInput(inputList);
  };

  const clickHandler = (y: number, x: number) => {
    console.log(y, x);
  };

  const bombChecke = (input: number[], bomb: number[], size: number[]) => {};

  const bombSearch = (input: number[], bomb: number[], size: number[]) => {};

  const board = (size: number[]) => {
    const calcBoard: number[][] = Array.from({ length: size[0] }, () =>
      new Array<number>(size[1]).fill(-1),
    );
    calcBoard[0][0] = 0;
    return calcBoard;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.board}
        style={{ width: `${boardSize[0] * 30}px`, height: `${boardSize[1] * 30}px` }}
      >
        {board(boardSize).map((row, y) =>
          row.map((i, x) => (
            <button
              key={`${y}-${x}`}
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
