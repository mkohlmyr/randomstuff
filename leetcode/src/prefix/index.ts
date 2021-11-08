export function longestCommonPrefix(strs: string[]): string {
  const max = Math.min(...strs.map((s) => s.length));
  let prefix = "";
  for (let i = 0; i < max; i++) {
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== strs[0][i]) return prefix;
    }
    prefix += strs[0][i];
  }
  return prefix;
}
