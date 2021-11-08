export function isPalindrome(x: number): boolean {
  if (x < 0) return false;
  if (x < 10) return true;

  const arr = [...x.toString()];

  while (arr.length > 1) {
    const a = arr.shift();
    const b = arr.pop();
    if (a !== b) return false;
  }

  return true;
}
