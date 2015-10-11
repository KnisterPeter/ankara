/// <reference path="../typings/references.d.ts" />
import {join, relative, sep, dirname} from 'path';
import {writeFileSync, readFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import * as globby from 'globby';
import {instrument} from './index'; 

const cwd = process.cwd();
const config = JSON.parse(readFileSync(join(cwd, '.ankara.json')).toString());
const exts = config.extensions || ['.js'];
const files: string[] = globby.sync(<string[]>config.files);
let oldHandlers = {};

console.log(files);

function isCovered(filename) {
  const relFile = `.${sep}${relative(cwd, filename)}`;
  return files.indexOf(relFile) > -1;
}

function loader(m, filename: string, old) {
  // console.log(`-- ${filename} -------------------------------`);
  let instr = instrument(filename);
  // console.log(instr);
  // console.log('---------------------------------');
  let instrumentedFilename = join(process.cwd(), 'coverage', relative(process.cwd(), filename));
  mkdirp(dirname(instrumentedFilename));
  writeFileSync(instrumentedFilename, instr);
  old(m, instrumentedFilename);
}

function registerExtension(ext: string) {
  var old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = function(m, filename) {
    if (isCovered(filename)) {
      loader(m, filename, old);
    } else {
      old(m, filename);
    }
  };
};

exts.forEach((ext) => {
  oldHandlers[ext] = require.extensions[ext];
  registerExtension(ext);
});
