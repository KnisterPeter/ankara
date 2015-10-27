/// <reference path="../typings/references.d.ts" />
import {prototype as modulePrototype} from 'module'; 
import minimist from 'minimist';
import * as globby from 'globby';
import {sync as mkdirp} from 'mkdirp';
import {sep, join, relative, dirname, resolve} from 'path';
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {instrumentFile, instrumentFiles, generateLcov} from './index';
import rc from 'rc';

const cwd = process.cwd();
const getExcludes = (config) => globby.sync(<string[]>config.excludes);
const isCovered = (filename, excludes) => excludes.indexOf(relative(cwd, filename)) == -1;

export default function(argv: string[]) {
  const config = rc('ankara', {
    extensions: ['.js'],
    excludes: ['**/node_modules/**']
  });
  const excludes = getExcludes(config);

  const args = minimist(argv);
  switch (args._[0]) {
    case 'cover':
      const originalRequire = modulePrototype.require;
      modulePrototype.require = function(id: string): string {
        var moduleToLoad = id;
        if (id[0] == '.') {
          var resolvedPath = resolve(dirname(this.id), id);
          if (!existsSync(resolvedPath)) {
            var temp = resolvedPath;
            resolvedPath = resolvedPath + config.extensions[0];
            if (!existsSync(resolvedPath)) {
              resolvedPath = temp + '.json';
            }
          }
          if (isCovered(resolvedPath, excludes)) {
            moduleToLoad = instrumentFile(resolvedPath);
          }
        }
        return originalRequire.call(this, moduleToLoad);
      }
      originalRequire(join(cwd, args._[1]));
      process.on('beforeExit', () => generateLcov());
      break;
    case 'instrument':
      globby.sync(<string[]>config.files).forEach(filename => {
        let next: string[] = [filename];
        do {
          const file = next.pop();
          const covered = isCovered(file, excludes);
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
