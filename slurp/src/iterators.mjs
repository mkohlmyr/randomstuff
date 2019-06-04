import { createReadStream } from 'fs';
import { createInterface } from 'readline';
// import { Deferred } from './deferred';

export async function file(f) {
    const rs = createReadStream(f);
    const ls = createInterface({ input: rs });

    for await (const line of ls) {
        // send each line where it needs to go
    }

    // clean up if necessary
}




// var myIterable = {
//     *[Symbol.iterator]() {
//         yield 1;
//         yield 2;
//         yield 3;
//     }
// }




// try {
//     if (fs.existsSync(path)) {
//       //file exists
//     }
//   } catch(err) {
//     console.error(err)
//   }

//   const fs = require('fs')

// const path = './file.txt'

// fs.access(path, fs.F_OK, (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }

//   //file exists
// })
