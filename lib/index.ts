/// <reference path="../typings/references.d.ts" />
import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';
import './cover';
import * as types from './types';
import * as th from './type-helper';
import {traverse} from './visitor';
import toJavaScript from './code-generator';

let devCover = path.join(__dirname, 'cover.js');
let devMode = fs.existsSync(devCover);

export function instrument(file: string): string {
  let ast = parse(file);
  // find(ast, 'ExpressionStatement,ReturnStatement')
  //   .forEach(stmt => { 
  //     stmt.expression.replaceWith(type.sequenceExpression([
  //       call-to-cover(),
  //       stmt.expression
  //     ])) 
  //   });
  traverse(ast, (node) => {
    if (th.isProgram(node)) {
      node.body.unshift(
        th.importDeclaration(
          [
            th.importNamespaceSpecifier(th.identifier('__$c'))
          ],
          devMode ?  th.literal(devCover) : th.literal('ankara/dist/cover')
        )
      );
    } else if (th.isStatement(node)) {
      console.log(node);
    }
  });
  return toJavaScript(ast);
}

function parse(file: string): types.File {
  let code = fs.readFileSync(file).toString('utf-8');
  return th.convert(babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  })) as types.File;
}
