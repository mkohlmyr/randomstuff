import { TreeNode, isSameTree } from "./index";
const cases = [
  {
    a: new TreeNode(
      1,
      null,
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    b: new TreeNode(
      1,
      null,
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    output: true,
  },
  {
    a: new TreeNode(1, null, null),
    b: new TreeNode(3, null, null),
    output: false,
  },
  { a: null, b: null, output: true },
  {
    a: new TreeNode(1, new TreeNode(2, null, null), null),
    b: new TreeNode(1, new TreeNode(2, null, null), null),
    output: true,
  },
  {
    a: new TreeNode(
      1,
      null,
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    b: new TreeNode(
      1,
      null,
      new TreeNode(2, new TreeNode(1, null, null), null)
    ),
    output: false,
  },
  {
    a: new TreeNode(
      1,
      new TreeNode(2, new TreeNode(3, null, null), null),
      null
    ),
    b: new TreeNode(
      1,
      new TreeNode(2, new TreeNode(3, null, null), null),
      new TreeNode(1, null, null)
    ),
    output: false,
  },
];

describe(".isSameTree", () => {
  it.each(cases)(
    "should return $output for the given input trees",
    ({ a, b, output }) => {
      const result = isSameTree(a, b);
      const expected = output;

      expect(result).toBe(expected);
    }
  );
});
