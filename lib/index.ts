/// <reference path="../typings/references.d.ts" />
import * as path from 'path';
import * as fs from 'fs';
import './cover';
import {parse, parseFragment} from './parser';
import * as types from './types';
import './register';

let devCover = path.join(__dirname, 'cover.js');
let devMode = fs.existsSync(devCover);

export function instrument(file: string): string {
  const relativeFile = path.relative(process.cwd(), file);
  let ast = parse(file);
  let statements = [];
  ast.visit(node => {
    if (node.instrumented) {
      statements.push(node.loc.start.line);
    }
  });
  ast.visit(node => {
    if (node instanceof types.Program) {
      let coverLib = devMode ? devCover : 'ankara/dist/cover';
      let fragment = <types.ImportDeclaration>parseFragment(`
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
