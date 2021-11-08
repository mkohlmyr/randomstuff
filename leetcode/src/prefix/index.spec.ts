import { longestCommonPrefix } from "./index";

describe(".longestCommonPrefix", () => {
  it.each`
    input                                           | value
    ${JSON.stringify(["flower", "flow", "flight"])} | ${"fl"}
    ${JSON.stringify(["dog", "racecar", "car"])}    | ${""}
  `("should return $value for input $input", ({ input, value }) => {
    const expected = value;
    const result = longestCommonPrefix(JSON.parse(input));
    expect(result).toBe(expected);
  });
});
