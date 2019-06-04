import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { ParsingException, RowException } from './errors';

export function stream(...files) {
  return files.map(f => createReadStream(f));
}

export function parse(rs) {
  return new Promise(async (resolve, reject) => {
    rs.on('error', reject);

    const lines = createInterface({ input: rs });
    const array = [];

    for await (const line of lines) {
      try {
        const row = JSON.parse(line);

        if (row.constructor !== Object) {
          return reject(new RowException('Invalid record', rs.path, array.length));
        }

        array.push(row);
      } catch (ex) {
        return reject(new ParsingException(ex.message, rs.path, array.length));
      }
    }

    return resolve(array);
  });
}

export async function collect(data) {
  return (await Promise.all(data)).flat();
}
