import { twoSum, twoSumFast } from "./index";

describe(".twoSum", () => {
  it.each`
    input                              | target                 | output
    ${JSON.stringify([2, 7, 11, 15])}  | ${JSON.stringify(9)}   | ${JSON.stringify([0, 1])}
    ${JSON.stringify([3, 2, 4])}       | ${JSON.stringify(6)}   | ${JSON.stringify([1, 2])}
    ${JSON.stringify([3, 3])}          | ${JSON.stringify(6)}   | ${JSON.stringify([0, 1])}
    ${JSON.stringify([500, 2, 0, 12])} | ${JSON.stringify(500)} | ${JSON.stringify([0, 2])}
    ${JSON.stringify([2, 5, 5, 11])}   | ${JSON.stringify(10)}  | ${JSON.stringify([1, 2])}
    ${JSON.stringify([3, 2, 3])}       | ${JSON.stringify(6)}   | ${JSON.stringify([0, 2])}
  `(
    "should return $output for input $input with target $target",
    ({ input, target, output }) => {
      const result = twoSum(JSON.parse(input), JSON.parse(target));
      const expected = JSON.parse(output);

      expect(result.length).toBe(expected.length);
      expect(result).toEqual(expect.arrayContaining(expected));
    }
  );
});

describe(".twoSumFast", () => {
  it.each`
    input                              | target                 | output
    ${JSON.stringify([2, 7, 11, 15])}  | ${JSON.stringify(9)}   | ${JSON.stringify([0, 1])}
    ${JSON.stringify([3, 2, 4])}       | ${JSON.stringify(6)}   | ${JSON.stringify([1, 2])}
    ${JSON.stringify([3, 3])}          | ${JSON.stringify(6)}   | ${JSON.stringify([0, 1])}
    ${JSON.stringify([500, 2, 0, 12])} | ${JSON.stringify(500)} | ${JSON.stringify([0, 2])}
    ${JSON.stringify([2, 5, 5, 11])}   | ${JSON.stringify(10)}  | ${JSON.stringify([1, 2])}
    ${JSON.stringify([3, 2, 3])}       | ${JSON.stringify(6)}   | ${JSON.stringify([0, 2])}
  `(
    "should return $output for input $input with target $target",
    ({ input, target, output }) => {
      const result = twoSumFast(JSON.parse(input), JSON.parse(target));
      const expected = JSON.parse(output);

      expect(result.length).toBe(expected.length);
      expect(result).toEqual(expect.arrayContaining(expected));
    }
  );
});
