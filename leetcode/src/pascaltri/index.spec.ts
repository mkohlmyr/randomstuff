import { generate } from "./index";

describe(".generate", () => {
  it.each`
    input                | output
    ${JSON.stringify(5)} | ${JSON.stringify([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]])}
    ${JSON.stringify(4)} | ${JSON.stringify([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]])}
    ${JSON.stringify(1)} | ${JSON.stringify([[1]])}
    ${JSON.stringify(3)} | ${JSON.stringify([[1], [1, 1], [1, 2, 1]])}
    ${JSON.stringify(7)} | ${JSON.stringify([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1], [1, 6, 15, 20, 15, 6, 1]])}
  `("should return $output for input $input", ({ input, output }) => {
    const expected = JSON.parse(output);
    const result = generate(JSON.parse(input));

    expect(result.length).toBe(expected.length);
    expect(result[result.length - 1]).toEqual(
      expect.arrayContaining(expected[expected.length - 1])
    );
  });
});
