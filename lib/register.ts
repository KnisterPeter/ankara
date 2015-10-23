/// <reference path="../typings/references.d.ts" />
import {join, relative, sep, dirname} from 'path';
import {writeFileSync, readFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import * as globby from 'globby';
import {instrument} from './index';
import rc from 'rc';

const cwd = process.cwd();
const config = rc('ankara', {
  extensions: ['.js']
});
const {extensions} = config;
const files: string[] = globby.sync(<string[]>config.files);
const oldHandlers = {};

function isCovered(filename): boolean {
  const relFile = `.${sep}${relative(cwd, filename)}`;
  return files.indexOf(relFile) > -1;
}

function loader(m, filename: string, old) {
  // console.log(`-- ${filename} -------------------------------`);
  const instr = instrument(filename);
  // console.log(instr);
  // console.log('---------------------------------');
  const instrumentedFilename = join(process.cwd(), 'coverage', relative(process.cwd(), filename));
  mkdirp(dirname(instrumentedFilename));
  writeFileSync(instrumentedFilename, instr);
  old(m, instrumentedFilename);
}

function registerExtension(ext: string) {
  const old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = function ankaraRequireHook(m, filename) {
    if (isCovered(filename)) {
      loader(m, filename, old);
    } else {
      old(m, filename);
    }
  };
};

extensions.forEach((ext) => {
  oldHandlers[ext] = require.extensions[ext];
  registerExtension(ext);
});
