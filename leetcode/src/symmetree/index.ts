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

export function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true;
  const iteration = (a: TreeNode | null, b: TreeNode | null): boolean => {
    return (
      (!a && !b) ||
      (a?.val === b?.val &&
        iteration(a?.left || null, b?.right || null) &&
        iteration(a?.right || null, b?.left || null))
    );
  };
  return iteration(root.left, root.right);
}
