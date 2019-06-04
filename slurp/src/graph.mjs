import { MinHeap } from './minheap';
import { distance, Coordinates } from './geography';

export class Graph {
  constructor() {
    this.nodes = new Map();
  }

  node({ id, lat, lon }) {
    this.nodes.set(id, {
      id,
      coordinates: new Coordinates({ lat, lon }),
      edges: new Set(),
    });
  }

  edge({ fromId, toId, id }) {
    const a = this.nodes.get(fromId);
    const b = this.nodes.get(toId);
    const d = distance(a.coordinates, b.coordinates);

    a.edges.add({
      id,
      to: b,
      distance: d,
    });

    b.edges.add({
      id,
      to: a,
      distance: d,
    });
  }

  dijkstra(start, destinations) {
    const pq = new MinHeap();
    const distance = new Map();
    const previous = new Map();

    distance.set(start, 0);
    previous.set(start, null);

    for (const edge of start.edges) {
      pq.enqueue(edge, edge.distance);
      distance.set(edge.to, edge.distance);
      previous.set(edge.to, start);
      destinations.delete(edge.to);
    }

    while (pq.size && destinations.size) {
      const { target } = pq.dequeue();

      for (const edge of target.edges) {
        if (previous.get(target) === edge.to) {
          continue;
        }
        const projected = distance.get(target) + edge.distance;
        const existing = distance.get(edge.to);

        if (!existing || projected < existing) {
          distance.set(edge.to, projected);
          previous.set(edge.to, target);

          pq.enqueue(edge, projected);
        }
      }
      destinations.delete(target);
    }

    return {
      distance,
      previous,
    };
  }

  nearest(deg) {
    const coordinates = new Coordinates(deg);
    let nearest = null;
    let min = Number.POSITIVE_INFINITY;

    for (const node of this.nodes.values()) {
      const measured = distance(coordinates, node.coordinates);
      if (measured < min) {
        min = measured;
        nearest = node;
      }
    }

    return nearest;
  }
}