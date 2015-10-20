/// <reference path="../typings/references.d.ts" />
import minimist from 'minimist';
import * as globby from 'globby';
import {sync as mkdirp} from 'mkdirp';
import {join, relative, dirname} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import {instrument, generateLcov} from './index';
import rc from 'rc';

export default function(argv: string[]) {
  const cwd = process.cwd();
  const config = rc('ankara', {
    extensions: ['.js']
  });

  const args = minimist(argv);
  switch (args._[0]) {
    case 'instrument':
      globby.sync(<string[]>config.files).forEach(filename => {
        const source = instrument(filename);
        const instrumentedFilename = join(cwd, 'coverage', relative(cwd, filename));
        mkdirp(dirname(instrumentedFilename));
        writeFileSync(instrumentedFilename, source);
        console.log(`Instrumented ${relative(cwd, filename)} -> ${relative(cwd, instrumentedFilename)}`);
      });
      break;
    case 'lcov':
      generateLcov();
      break;
  }
}
