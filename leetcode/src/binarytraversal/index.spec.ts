import { inorderTraversal, TreeNode } from "./index";

const cases = [
  {
    tree: new TreeNode(
      1,
      null,
      new TreeNode(2, new TreeNode(3, null, null), null)
    ),
    output: [1, 3, 2],
  },
  { tree: new TreeNode(1, null, null), output: [1] },
  { tree: null, output: [] },
  {
    tree: new TreeNode(1, new TreeNode(2, null, null), null),
    output: [2, 1],
  },
  {
    tree: new TreeNode(1, null, new TreeNode(2, null, null)),
    output: [1, 2],
  },
];

describe(".inorderTraversal", () => {
  it.each(cases)(
    "should return $output for a given input tree",
    ({ tree, output }) => {
      const result = inorderTraversal(tree);
      const expected = output;

      expect(result.length).toBe(expected.length);
      expect(result).toEqual(expect.arrayContaining(expected));
    }
  );
});
