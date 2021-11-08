export function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i] = (digits[i] + 1) % 10;
    if (digits[i]) return digits;
  }
  return [1, ...digits];
}
