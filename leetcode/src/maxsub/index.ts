export function maxSubArray(nums: number[]): number {
  let largest = Number.NEGATIVE_INFINITY;
  let current = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < nums.length; i++) {
    if (current + nums[i] < nums[i]) {
      current = nums[i];
    } else {
      current += nums[i];
    }

    if (current > largest) {
      largest = current;
    }
  }
  return largest;
}
