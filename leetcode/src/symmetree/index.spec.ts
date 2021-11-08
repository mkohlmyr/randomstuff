import { TreeNode, isSymmetric } from "./index";
const cases = [
  {
    tree: new TreeNode(
      1,
      new TreeNode(2, null, new TreeNode(3, null, null)),
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    output: true,
  },
  {
    tree: new TreeNode(
      2,
      new TreeNode(2, new TreeNode(3, null, null), new TreeNode(4, null, null)),
      new TreeNode(2, new TreeNode(4, null, null), new TreeNode(3, null, null))
    ),
    output: true,
  },
  { tree: null, output: true },
  {
    tree: new TreeNode(
      3,
      new TreeNode(2, new TreeNode(4, null, null), new TreeNode(3, null, null)),
      new TreeNode(2, new TreeNode(4, null, null), new TreeNode(3, null, null))
    ),
    output: false,
  },
  {
    tree: new TreeNode(
      4,
      new TreeNode(2, new TreeNode(3, null, null), null),
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    output: false,
  },
];

describe(".isSymmetric", () => {
  it.each(cases)(
    "should return $output for the given input tree $tree",
    ({ tree, output }) => {
      const result = isSymmetric(tree);
      const expected = output;

      expect(result).toBe(expected);
    }
  );
});
