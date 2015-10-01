/// <reference path="../typings/references.d.ts" />
import {join} from 'path';
import {sync as mkdirp} from 'mkdirp';
import {readFileSync, writeFileSync} from 'fs';

interface CoverageData {
  [file: string]: FileCoverageData;
}

interface FileCoverageData {
  numStatements: number;
  lines: number[];
}

class Cover {

  private dirname: string;

  private data: CoverageData = {};

  init(file: string, numStatements: number) {
    this.dirname = join(process.cwd(), 'coverage');
    mkdirp(this.dirname);
    this.data[file] = {
      numStatements,
      lines: []
    };
    this.flush();
  }

  statement(file: string, line: number) {
    if (this.data[file].lines.indexOf(line) === -1) {
      this.data[file].lines.push(line);
    }
    this.flush();
  }

  private flush() {
    writeFileSync(join(this.dirname, 'data.json'), JSON.stringify(this.data, undefined, ' '));
  }

}

export let cover = new Cover();
