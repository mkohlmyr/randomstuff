type Numeral = "I" | "V" | "X" | "L" | "C" | "D" | "M";
export function romanToInt(s: string): number {
  const table: Record<Numeral, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let sum = 0;
  let i = 0;
  while (i < s.length) {
    const a = table[s[i] as Numeral];
    const b = table[s[i + 1] as Numeral];

    if (!b || a >= b) {
      sum += a;
      i += 1;
    } else {
      sum += b - a;
      i += 2;
    }
  }
  return sum;
}
