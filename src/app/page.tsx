'use client';

import { useEffect, useState } from 'react';
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

  const [userInput, setUserInput] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [bombsMap, setBombsMap] = useState<number[][]>([]);

  const [calcTime, setTime] = useState<{ time: number; running: boolean }>({
    time: 0,
    running: false,
  });

  const [level, setLevel] = useState<string>();

  const [boardSize, setBoardSize] = useState([9, 9]);

  const [bombsNumber, setBombsNumber] = useState(10);

  const [sampleCounter, setSampleCounter] = useState(0);

  useEffect(() => {
    if (!calcTime.running) return;

    const timer = setInterval(() => {
      setTime((prev) => ({ ...prev, time: prev.time + 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [calcTime.running]);

  const setBoardLevel = (level: number) => {
    ///レベルを選択した時に起動する関数、ボードサイズを決め、セットインプットリストも起動する
    let Size: number[] = [];
    let bomb: number = 0;
    if (level === 0) {
      setLevel('easy');
      Size = [9, 9];
      bomb = 10;
    } else if (level === 1) {
      setLevel('normal');
      Size = [16, 16];
      bomb = 40;
    } else if (level === 2) {
      setLevel('hard');
      Size = [16, 30];
      bomb = 99;
    } else if (level === 3) {
      setLevel('custom');
    }
    setTime({ time: 0, running: false });
    setBoardSize(Size);
    setInputList(Size);
    setBombsNumber(bomb);
  };

  const setInputList = (size: number[]) => {
    ///インプットリストをボードサイズに基づいて決定する
    const inputList: number[][] = Array.from({ length: size[0] }, () =>
      new Array<number>(size[1]).fill(0),
    );
    setUserInput(inputList);
  };

  const generateBombMap = (
    rows: number,
    cols: number,
    count: number,
    avoid: [number, number],
  ): number[][] => {
    const [ay, ax] = avoid;
    const map: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
    let placed = 0;
    while (placed < count) {
      const y = Math.floor(Math.random() * rows);
      const x = Math.floor(Math.random() * cols);
      if ((y !== ay || x !== ax) && map[y][x] === 0) {
        map[y][x] = 1;
        placed++;
      }
    }
    return map;
  };

  const handleRightClick = (e: React.MouseEvent, y: number, x: number) => {
    e.preventDefault();

    if (isGameOver(userInput, bombsMap)) {
      console.warn('ゲームオーバー状態なので右クリック無効');
      return;
    }
    const temp = structuredClone(userInput);
    const display = board(userInput, bombsMap);
    if (display[y][x] !== -2 && display[y][x] !== 9 && display[y][x] !== 8) return;
    if (temp[y][x] === 1) return;

    if (temp[y][x] === 0) {
      temp[y][x] = 9;
    } else if (temp[y][x] === 9) {
      temp[y][x] = 8;
    } else if (temp[y][x] === 8) {
      temp[y][x] = 0;
    }
    setUserInput(temp);
  };

  const clickHandler = (y: number, x: number) => {
    if (isGameOver(userInput, bombsMap)) {
      console.log('ゲームオーバー状態なのでクリック無効');
      return;
    }
    const oneTimeInput = structuredClone(userInput);
    ///まず爆弾被りのチェック、被っていたらゲームオーバー、被ってないならbombSearch起動して全部終わったら格納
    ///初回チェック
    if (!userInput[y] || userInput[y][x] === undefined) {
      console.warn('クリック範囲外です');
      return;
    }
    if (userInput[y][x] === 9) {
      console.log('フラッグのある場所はクリックできません');
      return;
    }
    if (!userInput.flat().includes(1)) {
      setTime({ time: 0, running: true });
      ///1が含まれていないので初回爆弾生成後爆弾ボード所有CheckAround
      const [rows, cols] = boardSize;
      const generated = generateBombMap(rows, cols, bombsNumber, [y, x]);
      setBombsMap(generated);

      const tempInput = structuredClone(userInput);
      tempInput[y][x] = 1;

      setUserInput(tempInput);
      console.log('ボムマップ', bombsMap);
      return;
    }
    ///2回目以降なのでクリックチェックの後通常CheckAround
    const tempInput = structuredClone(userInput);
    tempInput[y][x] = 1;
    setUserInput(tempInput);
    callGameOver(tempInput, bombsMap);
    if (callGameClear(tempInput, bombsMap)) {
      alert('クリア');
    }
    return;
  };

  const CheckAround = (input: number[], bombmap: number[][]) => {
    ///周囲に爆弾があるかのチェックをする、周囲にある爆弾の数を返り値にする
    let count = 0;
    for (const direction of directions) {
      const dy = direction[0] + input[0];
      const dx = direction[1] + input[1];
      if (bombmap[dy] !== undefined && bombmap[dy][dx] !== undefined && bombmap[dy][dx] === 1) {
        count += 1;
      }
    }
    return count;
  };

  const bombSearch = (input: [number, number], bombmap: number[][], explored: number[][]) => {
    ///自身から召喚される、周囲の爆弾を確認する機能と、周囲に無かった場合周りの8コマに自分を適応する機能を持つ
    ///探索済みリストを使う、探索済みリスト受け取って探索に行き、探索済みリストを返す
    const [y, x] = input;
    const rows = boardSize[0];
    const cols = boardSize[1];
    ///2が未探索を意味するので、未探索でない場合終了する処理
    if (y < 0 || y >= rows || x < 0 || x >= cols || explored[y][x] !== -2) {
      return explored;
    }
    const inNumber: number = CheckAround(input, bombmap);
    let result: number[][] = explored.map((row) => [...row]);
    ///-1が0,0が1を表すため-1
    result[y][x] = inNumber - 1;
    if (inNumber === 0) {
      for (const direction of directions) {
        const dy = direction[0] + input[0];
        const dx = direction[1] + input[1];
        result = bombSearch([dy, dx], bombmap, result);
      }
      ///0確認時拡散処理
    }
    return result;
  };

  const findOnes = (grid: number[][], search: number): [number, number][] => {
    const result: [number, number][] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === search) {
          result.push([y, x]);
        }
      }
    }
    return result;
  };

  const fullSearch = (
    InputList: number[][],
    explored: number[][],
    bombmap: number[][],
  ): number[][] => {
    const ones = findOnes(InputList, 1);
    let result = explored.map((row) => [...row]);
    for (const [y, x] of ones) {
      result = bombSearch([y, x], bombmap, result);
    }
    return result;
  };

  const callGameOver = (input: number[][], bombs: number[][]): boolean => {
    const result = isGameOver(input, bombs);
    if (result) {
      setTime((prev) => ({ ...prev, running: false }));
    }
    return result;
  };

  const callGameClear = (input: number[][], bombs: number[][]): boolean => {
    const result = isGameClear(input, bombs);
    if (result) {
      setTime((prev) => ({ ...prev, running: false }));
    }
    return result;
  };

  const isGameOver = (input: number[][], bombs: number[][]): boolean => {
    return input.some((row, y) => row.some((cell, x) => cell === 1 && bombs[y]?.[x] === 1));
  };

  const isGameClear = (input: number[][], bombs: number[][]): boolean => {
    if (!input.length || !input[0]?.length) return false;
    if (!bombs.length || !bombs[0]?.length) return false;

    const rows = input.length;
    const cols = input[0]?.length || 0;
    const boardData = board(input, bombs);
    console.log('ボードデータ', boardData);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isBomb = bombs[y][x] === 1;
        const isOpen = boardData[y][x] >= -1 && boardData[y][x] <= 7;
        if (!isBomb && !isOpen) {
          return false;
        }
      }
    }
    return true;
  };

  const calcBombs = (input: number[][], bombs: number[][]) => {
    const countValidFlags = (input: number[][], board: number[][]): number => {
      let count = 0;
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[0].length; x++) {
          if (board[y][x] === 9) {
            count++;
          }
        }
      }
      return count;
    };
    if (bombs.length > 0 && bombsMap.some((row) => row.length > 0)) {
      const displayBoard = board(input, bombs);
      const remainingBombs = bombsNumber - countValidFlags(userInput, displayBoard);
      return remainingBombs;
    }
  };

  const resetBoard = () => {
    setInputList(boardSize);
    setBombsMap([]);
    setTime({ time: 0, running: false });
  };

  const board = (input: number[][], bombs: number[][]) => {
    const rows = boardSize[0];
    const cols = boardSize[1];
    if (input.length !== rows || input[0]?.length !== cols) {
      return Array.from({ length: rows }, () => new Array<number>(cols).fill(-1));
    }

    const setting: number[][] = Array.from({ length: rows }, () =>
      new Array<number>(cols).fill(-2),
    );

    const rawBoard = fullSearch(input, setting, bombs);

    const GameOver = isGameOver(input, bombs);

    const displayBoard: number[][] = rawBoard.map((row, y) =>
      row.map((cell, x) => {
        const inputState = input[y][x];

        if (GameOver) {
          if (bombs[y][x] === 1) return 10;
          if (inputState === 9) {
            return 9;
          }
          return cell;
        }
        if (cell !== -2) return cell;
        if (inputState === 9) return 9;
        if (inputState === 8) return 8;

        return -2;
      }),
    );
    return displayBoard;
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>残りボム数:{calcBombs(userInput, bombsMap)}</h2>
        <button onClick={resetBoard}>リセット</button>
        <h2>経過時間: {calcTime.time}秒</h2>
      </div>
      <button onClick={() => setBoardLevel(0)}>初級</button>
      <button onClick={() => setBoardLevel(1)}>中級</button>
      <button onClick={() => setBoardLevel(2)}>上級</button>
      <button onClick={() => setBoardLevel(3)}>カスタム</button>
      <div
        className={styles.board}
        style={{ width: `${boardSize[1] * 30}px`, height: `${boardSize[0] * 30}px` }}
      >
        {board(userInput, bombsMap).map((row, y) =>
          row.map((i, x) => (
            <button
              key={`${y}-${x}`}
              onClick={() => clickHandler(y, x)}
              onContextMenu={(e) => handleRightClick(e, y, x)}
              className={`${styles.cell} ${i === -2 || i === 8 || i === 9 ? styles.cellUnopend : styles.cellOpened}`}
              style={{ backgroundPosition: `${-30 * i}px` }}
            />
          )),
        )}
      </div>
    </div>
  );
}
