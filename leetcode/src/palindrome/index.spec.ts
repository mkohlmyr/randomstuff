import { isPalindrome } from "./index";

describe(".isPalindrome", () => {
  it.each`
    input                   | output
    ${JSON.stringify(121)}  | ${JSON.stringify(true)}
    ${JSON.stringify(-121)} | ${JSON.stringify(false)}
    ${JSON.stringify(10)}   | ${JSON.stringify(false)}
    ${JSON.stringify(-101)} | ${JSON.stringify(false)}
  `("should return $value for input $input", ({ input, output }) => {
    const expected = JSON.parse(output);
    const result = isPalindrome(JSON.parse(input));
    expect(result).toBe(expected);
  });
});
