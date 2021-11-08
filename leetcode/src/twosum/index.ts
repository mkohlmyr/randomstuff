export function twoSum(nums: number[], target: number): number[] {
  let i: number = 0;
  let j: number = 1;

  for (i = 0; i < nums.length - 1; i++) {
    for (j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [nums.length - 2, nums.length - 1];
}

export function twoSumFast(nums: number[], target: number): number[] {
  const mem = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const rem = target - nums[i];
    const found = mem.get(rem);
    if (found !== undefined) return [found, i];

    mem.set(nums[i], i);
  }
  throw new Error("unreachable given problem constraints");
}
