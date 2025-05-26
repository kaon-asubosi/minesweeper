'use client';

import { useState } from 'react';
import styles from './page.module.css';

const down = (n: number) => {
  console.log(n);
  if (n > 0) {
    return down(n - 1);
  }
};

const sum1 = (n: number): number => {
  if (n === 0) {
    return n;
  } else {
    return sum1(n - 1) + n;
  }
};

const sum2 = (g: number, n: number): number => {
  if (n === g) {
    return n;
  } else {
    return sum2(g, n - 1) + n;
  }
};

const sum3 = (g: number, n: number): number => {
  return ((g + n) * (n - g + 1)) / 2;
};

console.log(sum1(10));

console.log(sum2(4, 10));

console.log(sum3(4, 10));

down(10);

export default function Home() {
  const [sampleCounter, setsampleCounter] = useState(0);
  console.log(sampleCounter);
  const [numbers, setNu] = useState([0, 0, 0, 0, 0]);
  const calcTotal = (arr: number[]) => {
    let total = 0;
    for (let i = 0; i < 5; i++) {
      total += arr[i];
    }
    return total;
  };
  const sampleclickHandler = () => {
    const newNumbers = structuredClone(numbers);
    newNumbers[sampleCounter % 5] += 1;
    setNu(newNumbers);
    console.log(numbers);
    setsampleCounter((sampleCounter + 1) % 14);

    const to = calcTotal(numbers);
    console.log(to);
  };

  return (
    <div className={styles.container}>
      <button onClick={() => sampleclickHandler()}>クリック</button>
      <div
        className={styles.sampleCell}
        style={{ backgroundPosition: `${String(-30 * sampleCounter)}px` }}
      />
    </div>
  );
}
