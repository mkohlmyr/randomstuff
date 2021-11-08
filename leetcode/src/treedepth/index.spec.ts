import { TreeNode, maxDepth } from "./index";
const cases = [
  {
    tree: new TreeNode(1, null, null),
    output: 1,
  },
  {
    tree: new TreeNode(2, new TreeNode(2, null, null), null),
    output: 2,
  },
  {
    tree: new TreeNode(
      2,
      new TreeNode(2, null, null),
      new TreeNode(2, null, null)
    ),
    output: 2,
  },
  { tree: null, output: 0 },
  {
    tree: new TreeNode(
      5,
      new TreeNode(3, new TreeNode(3, null, null), new TreeNode(3, null, null)),
      new TreeNode(
        5,
        new TreeNode(5, new TreeNode(5, null, new TreeNode(5)), null),
        null
      )
    ),
    output: 5,
  },
];

describe(".maxDepth", () => {
  it.each(cases)(
    "should return $output for the given input tree $tree",
    ({ tree, output }) => {
      const result = maxDepth(tree);
      const expected = output;

      expect(result).toBe(expected);
    }
  );
});
