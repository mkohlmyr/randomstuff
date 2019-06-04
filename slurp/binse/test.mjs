const a = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24];
const b = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 22, 23, 24];


const search = (source, target) => {
  let first = 0;
  let last = source.length - 1;
  let middle = null;
  while (first <= last) {
    middle = Math.ceil((first + last) / 2);

    if (source[middle] === target) {
      return middle;
    }

    if (source[middle] > target) {
      last = middle - 1;
    }
    if (source[middle] < target) {
      first = middle + 1;
    }
  }

  return null;
};

const sort = () => {

};

console.log(search(a, 19));
console.log(search(b, 19));
console.log(search(a, 3));
console.log(search(b, 3));
console.log(search(a, 24));
console.log(search(b, 24));
console.log(search(a, 1));
console.log(search(b, 1));