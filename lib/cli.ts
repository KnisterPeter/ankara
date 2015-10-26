/// <reference path="../typings/references.d.ts" />
import minimist from 'minimist';
import * as globby from 'globby';
import {sync as mkdirp} from 'mkdirp';
import {sep, join, relative, dirname} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import {instrumentFiles, generateLcov} from './index';
import rc from 'rc';

export default function(argv: string[]) {
  const cwd = process.cwd();
  const config = rc('ankara', {
    extensions: ['.js'],
    excludes: ['**/node_modules/**']
  });

  const args = minimist(argv);
  switch (args._[0]) {
    case 'instrument':
      const excludes = globby.sync(<string[]>config.excludes);
      const isCovered = (filename) => excludes.indexOf(relative(cwd, filename)) == -1;
      globby.sync(<string[]>config.files).forEach(filename => {
        let next: string[] = [filename];
        do {
          const file = next.pop();
          const covered = isCovered(file);
          next = next.concat(instrumentFiles(file, covered));
          if (covered) {
            console.log(`Instrumented ${relative(cwd, file)}`);
          }
        } while (next.length > 0);
      });
      break;
    case 'lcov':
      generateLcov();
      break;
  }
}
