import promisify from 'es6-promisify';
import {join} from 'path';
import mkdirp from 'mkdirp';
import {readFileSync as readFileSyncNodeback, writeFileSync as writeFileSyncNodeback} from 'fs';
const readFileSync = promisify(readFileSyncNodeback);
const writeFileSync = promisify(writeFileSyncNodeback);

class Cover {

  async init(file: string, numStatements: number):void {
    console.log('RUN INIT');
    const dirname = join(__dirname, 'coverage');
    mkdirp.sync(dirname);
    await writeFileSync(join(dirname, 'data.json'), JSON.stringify({
      [file]: {
        numStatements
      }
    }));
  }

  statement(file: string, line: number): void {
  }

}

export let cover = new Cover();
