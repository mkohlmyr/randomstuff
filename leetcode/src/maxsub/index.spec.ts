import { maxSubArray } from "./index";

describe(".maxSubArray", () => {
  it.each`
    input                                              | output
    ${JSON.stringify([-2, 1, -3, 4, -1, 2, 1, -5, 4])} | ${JSON.stringify(6)}
    ${JSON.stringify([1])}                             | ${JSON.stringify(1)}
    ${JSON.stringify([5, 4, -1, 7, 8])}                | ${JSON.stringify(23)}
    ${JSON.stringify([-5, -5, 5, 5, -2, 3, -5])}       | ${JSON.stringify(11)}
    ${JSON.stringify([1, 2])}                          | ${JSON.stringify(3)}
  `("should return $output for input $input", ({ input, output }) => {
    const expected = JSON.parse(output);
    const result = maxSubArray(JSON.parse(input));

    expect(result).toBe(expected);
  });
});
