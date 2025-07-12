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

  const [level, setLevel] = useState<string>();

  const [boardSize, setBoardSize] = useState([9, 9]);

  const [bombsNumber, setBombsNumber] = useState(10);

  const [sampleCounter, setSampleCounter] = useState(0);

  const sampleClickHandler = () => {
    setSampleCounter((sampleCounter + 1) % 15);
  };

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
    setBoardSize(Size);
    setInputList(Size);
    setBombsNumber(bomb);
  };

  const setInputList = (size: number[]) => {
    ///インプットリストをボードサイズに基づいて決定する
    const inputList: number[][] = Array.from({ length: boardSize[0] }, () =>
      new Array<number>(boardSize[1]).fill(0),
    );
    setUserInput(inputList);
  };

  const clickHandler = (y: number, x: number) => {
    const oneTimeInput = structuredClone(userInput);
    ///まず爆弾被りのチェック、被っていたらゲームオーバー、被ってないならbombSearch起動して全部終わったら格納
    ///初回チェック
    if (userInput.flat().includes(1)) {
      ///1が含まれていないので初回爆弾生成後爆弾ボード所有CheckAround
    } else {
      ///2回目以降なのでクリックチェックの後通常CheckAround
      bombChecke([y, x]);
      console.log(y, x);
      return true;
    }
  };

  const bombChecke = (input: number[]) => {
    ///2回目以降の処理爆弾と被っていないかを確認する
  };
  ///爆弾とクリックが被ってるかのチェック、初回（inputに1が無い時）だけ爆弾を生成する機能を持つ爆弾生成後は一回目は素通しする

  const CheckAround = (input: number[], bombmap: number[][]) => {
    ///周囲に爆弾があるかのチェックをする、周囲にある爆弾の数を返り値にする
    let count = 0;
    for (const direction of directions) {
      const dy = direction[0] + input[0];
      const dx = direction[1] + input[1];
      if (bombsMap[dy] !== undefined && bombsMap[dy][dx] !== undefined && bombsMap[dy][dx] === 1) {
        count += 1;
      }
    }
    return count;
  };

  const bombSearch = (input: number[], bombmap: number[][], explored: number[][]) => {
    ///自身から召喚される、周囲の爆弾を確認する機能と、周囲に無かった場合周りの8コマに自分を適応する機能を持つ
    ///探索済みリストを使う、探索済みリスト受け取って探索に行き、探索済みリストを返す
    const inNumber: number = CheckAround(input, bombmap);
    let result: number[][] = explored.map((row) => [...row]);
    ///-1が0,0が1を表すため-1
    result[input[0]][input[1]] = inNumber - 1;
    if (inNumber === 0) {
      for (const direction of directions) {
        const dy = direction[0] + input[0];
        const dx = direction[1] + input[1];
        if (result[dy] !== undefined && result[dy][dx] !== undefined && result[dy][dx] === -2)
          ///枠外にズレていないかのチェックと既に探索しているかのチェックをここに挿入
          result = bombSearch([dy, dx], bombmap, result).map((row) => [...row]);
      }
      ///0確認時拡散処理
    }
    return result;
  };

  const board = (size: number[]) => {
    const calcBoard: number[][] = Array.from({ length: size[0] }, () =>
      new Array<number>(size[1]).fill(-2),
    );
    calcBoard[0][0] = 0;
    return calcBoard;
  };

  return (
    <div className={styles.container}>
      <button onClick={() => setBoardLevel(0)}>初級</button>
      <button onClick={() => setBoardLevel(1)}>中級</button>
      <button onClick={() => setBoardLevel(2)}>上級</button>
      <button onClick={() => setBoardLevel(3)}>カスタム</button>
      <div
        className={styles.board}
        style={{ width: `${boardSize[1] * 30}px`, height: `${boardSize[0] * 30}px` }}
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
