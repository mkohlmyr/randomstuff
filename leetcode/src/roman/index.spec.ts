import { romanToInt } from "./index";

describe(".romanToInt", () => {
  it.each`
    input        | value
    ${"III"}     | ${JSON.stringify(3)}
    ${"IV"}      | ${JSON.stringify(4)}
    ${"IX"}      | ${JSON.stringify(9)}
    ${"LVIII"}   | ${JSON.stringify(58)}
    ${"MCMXCIV"} | ${JSON.stringify(1994)}
    ${"XXXVI"}   | ${JSON.stringify(36)}
    ${"XXIX"}    | ${JSON.stringify(29)}
    ${"XCIV"}    | ${JSON.stringify(94)}
    ${"LIX"}     | ${JSON.stringify(59)}
  `("should return $value for input $input", ({ input, value }) => {
    const expected = JSON.parse(value);
    const result = romanToInt(input);
    expect(result).toBe(expected);
  });
});
