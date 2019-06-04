export class MinHeap {
  constructor() {
    this.heap = [
      null,
    ];
  }

  get size() {
    return this.heap.length - 1;
  }

  enqueue(edge, weight) {
    this.heap.push({
      target: edge.to,
      weight,
    });

    let nodeIdx = this.heap.length - 1;
    let parentIdx = Math.floor(nodeIdx / 2);

    while (
      this.heap[parentIdx] &&
      this.heap[nodeIdx].weight < this.heap[parentIdx].weight
    ) {
      const node = this.heap[nodeIdx];
      const parent = this.heap[parentIdx];

      this.heap[parentIdx] = node;
      this.heap[nodeIdx] = parent;

      nodeIdx = parentIdx;
      parentIdx = Math.floor(nodeIdx / 2);
    }
  }

  argmin(leftIdx, rightIdx) {
    if (
      this.heap[rightIdx] &&
      this.heap[rightIdx].weight <= this.heap[leftIdx].weight
    ) {
      return rightIdx;
    } else if (
      this.heap[leftIdx]
    ) {
      return leftIdx;
    } else {
      return -1;
    }
  }

  dequeue() {
    if (this.heap.length === 1) {
      return null;
    }

    if (this.heap.length === 2) {
      return this.heap.pop();
    }
    let nodeIdx = 1;

    const head = this.heap[nodeIdx];
    const tail = this.heap.pop();

    this.heap[nodeIdx] = tail;

    while (true) {
      const minChildIdx = this.argmin((2 * nodeIdx), (2 * nodeIdx) + 1);
      if (
        this.heap[minChildIdx] &&
        this.heap[minChildIdx].weight < this.heap[nodeIdx].weight
      ) {
        const node = this.heap[nodeIdx];
        const child = this.heap[minChildIdx];

        this.heap[minChildIdx] = node;
        this.heap[nodeIdx] = child;

        nodeIdx = minChildIdx;
      } else {
        break;
      }
    }

    return head;
  }
}