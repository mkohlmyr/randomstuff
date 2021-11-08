import { plusOne } from "./index";

describe(".plusOne", () => {
  it.each`
    input                           | output
    ${JSON.stringify([1, 2, 3])}    | ${JSON.stringify([1, 2, 4])}
    ${JSON.stringify([4, 3, 2, 1])} | ${JSON.stringify([4, 3, 2, 2])}
    ${JSON.stringify([0])}          | ${JSON.stringify([1])}
    ${JSON.stringify([9])}          | ${JSON.stringify([1, 0])}
    ${JSON.stringify([1, 9, 9, 9])} | ${JSON.stringify([2, 0, 0, 0])}
  `("should return $output for input $input", ({ input, output }) => {
    const expected = JSON.parse(output);
    const result = plusOne(JSON.parse(input));

    expect(result.length).toBe(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
