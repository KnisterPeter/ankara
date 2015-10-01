/// <reference path="../typings/references.d.ts" />
import {join, relative, sep, dirname} from 'path';
import {writeFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import {instrument} from './index';

const exts = ['.js'];

let oldHandlers = {};
let cwd = process.cwd();

function isIgnored(filename) {
  return relative(cwd, filename).split(sep).indexOf("node_modules") >= 0;
}

function loader(m, filename: string, old) {
  let instr = instrument(filename);
  // console.log(`-- ${filename} -------------------------------`);
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
    if (isIgnored(filename)) {
      old(m, filename);
    } else {
      loader(m, filename, old);
    }
  };
};

exts.forEach((ext) => {
  oldHandlers[ext] = require.extensions[ext];
  registerExtension(ext);
});
