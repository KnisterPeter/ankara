/// <reference path="../typings/references.d.ts" />
import 'source-map-support/register';
import {join, relative} from 'path';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {CoverageData, FileCoverageData} from './cover';
import {parse, parseFragment} from './parser';

import {Program} from './types/program';
import {ImportDeclaration} from './types/import-declaration';

let devCover = join(__dirname, 'cover.js');
let devMode = existsSync(devCover);

export function instrument(file: string): string {
  const relativeFile = relative(process.cwd(), file);
  let ast = parse(file);
  let statements = [];
  ast.visit(node => {
    if (node.instrumented) {
      statements.push(node.loc.start.line);
    }
  });
  ast.visit(node => {
    if (node instanceof Program) {
      let coverLib = devMode ? devCover : 'ankara/dist/cover';
      let fragment = parseFragment(`
        import {cover as __$c} from '${coverLib}';
        __$c.init("${relativeFile}", [${statements}]);
      `);
      node.body[0].insertBefore(fragment);
    } else if (node.instrumented) {
      node.instrument(relativeFile);
    }
  });
  return ast.toJavaScript();
}

export function generateLcov() {
  const dirname = join(process.cwd(), 'coverage');
  const data = <CoverageData>JSON.parse(readFileSync(join(dirname, 'data.json')).toString());
  let lcov = 'TN:\n';
  Object.keys(data).forEach(file => {
    lcov += `SF: ${join(process.cwd(), file)}\n`;
    const fileData = data[file];
    lcov += fileData.lines
      .sort((a, b) => a - b)
      .map(line => `DA:${line},1\n`)
      .join('');
    lcov += `LF:${fileData.statements.length}\n`;
    lcov += `LH:${fileData.lines.length}\n`;
    lcov += 'end_of_record\n';
  });
  writeFileSync(join(dirname, 'lcov.info'), lcov);
}
