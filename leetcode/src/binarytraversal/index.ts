export class TreeNode {
  public val: number;
  public left: TreeNode | null;
  public right: TreeNode | null;

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export function inorderTraversal(root: TreeNode | null): number[] {
  // Given the root of a binary tree,
  // return the inorder traversal of its nodes' values.
  const iteration = (node: TreeNode | null): number[] => {
    if (!node) return [];
    return iteration(node.left).concat(node.val, iteration(node.right));
  };

  return iteration(root);
}
