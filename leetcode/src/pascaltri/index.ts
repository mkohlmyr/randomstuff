export function generate(numRows: number): number[][] {
  // 1 -> [1]
  // 2 -> [1, 1]
  // 3 -> [1, 2, 1]
  // 4 -> [1, 3, 3, 1]
  // 5 -> [1, 4, 6, 4, 1]
  // 6 -> [1, 5, 10, 10, 5, 1]
  // 7 -> [1, 6, 15, 20, 15, 6, 1]
  // 8 -> [1, 7, 21, 35, 35, 21, 7, 1]
  // if (numRows === 1) return [[1]];
  // if (numRows === 2) return [[1], [1, 1]];

  const r = [];
  for (let i = 1; i <= numRows; i++) {
    r.push(new Array(i).fill(1));
    for (let j = 1; j < i - 1; j++) {
      r[i - 1][j] = r[i - 2][j - 1] + r[i - 2][j];
    }
  }
  return r;
}
