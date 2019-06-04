import edges from '../dat/edges.json';
import ports from '../dat/ports.json';
import nodes from '../dat/nodes.json';

import { Graph } from './graph';

export const graph = new Graph();

nodes.forEach(graph.node.bind(graph));
edges.forEach(graph.edge.bind(graph));

export function calculate(consignor, consignee) {
  const loadport = ports.find(p => p.companies.includes(consignor));
  const discport = ports.find(p => p.companies.includes(consignee));

  const loadnode = graph.nearest(loadport);
  const discnode = graph.nearest(discport);

  const { distance } = graph.dijkstra(loadnode, new Set([discnode]));

  return {
    loadport: loadport.name,
    discport: discport.name,
    consignee,
    consignor,
    distance: distance.get(discnode)
  };
}
