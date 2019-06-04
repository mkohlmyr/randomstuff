import { stream, parse, collect } from '../src/files.mjs';
import { filter, transform, sort } from '../src/processing.mjs';

const [, , ...files] = process.argv;

collect(stream(...files).map(parse))
  .then(filter)
  .then(transform)
  .then(sort)
  .then(console.table)
  .catch(console.error);
