type OpeningBracket = "(" | "{" | "[";
type ClosingBracket = ")" | "}" | "]";
export function isValid(s: string): boolean {
  const m: Record<OpeningBracket, ClosingBracket> = {
    "(": ")",
    "{": "}",
    "[": "]",
  };
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] in m) {
      stack.push(m[s[i] as OpeningBracket]);
    } else if (s[i] === stack[stack.length - 1]) {
      stack.pop();
    } else {
      return false;
    }
  }

  return stack.length === 0;
}
