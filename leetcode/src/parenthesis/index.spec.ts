import { isValid } from "./index";

describe(".isValid", () => {
  it.each`
    input       | output
    ${"()"}     | ${JSON.stringify(true)}
    ${"()[]{}"} | ${JSON.stringify(true)}
    ${"(]"}     | ${JSON.stringify(false)}
    ${"([)]"}   | ${JSON.stringify(false)}
    ${"{[]}"}   | ${JSON.stringify(true)}
  `("should return $value for input $input", ({ input, output }) => {
    const expected = JSON.parse(output);
    const result = isValid(input);
    expect(result).toBe(expected);
  });
});
