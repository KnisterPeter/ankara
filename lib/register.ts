/// <reference path="../typings/references.d.ts" />
import {join, relative, sep, dirname} from 'path';
import {writeFileSync, readFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import * as globby from 'globby';
import {instrumentFile} from './index';
import rc from 'rc';

const cwd = process.cwd();
const config = rc('ankara', {
  extensions: ['.js']
});
const {extensions} = config;
const excludes: string[] = globby.sync(<string[]>config.excludes);
const oldHandlers = {};
const isCovered = (filename) => excludes.indexOf(relative(cwd, filename)) == -1;

function loader(m, filename: string, old) {
  const instrumentedFilename = instrumentFile(filename);
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
