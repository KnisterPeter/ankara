/// <reference path="../typings/references.d.ts" />
import {readFileSync} from 'fs';
import * as babylon from 'babylon';
import {convert} from './type-helper';
import {File} from './types/file';
import {Node} from './types/node';

const parserOptions = {
  sourceType: "module",
  allowReserved: true,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  plugins: {
    flow: true
  },
  features: {
    'es7.classProperties': true,
    'es7.asyncFunctions': true,
    'es7.decorators': true,
    'es7.trailingFunctionCommas': true,
    'es7.exportExtensions': true,
    'es7.doExpressions': true,
    'es7.comprehensions': true,
    'es7.objectRestSpread': true,
    'es7.exponentiationOperator': true,
    'es7.functionBind': true
  }
};

export function parse(file: string): File {
  let code = readFileSync(file).toString();
  let ast = babylon.parse(code, parserOptions);
  return <File>convert(ast, null)
}

export function parseFragment(code: string): Node<any>[] {
  return (<File>convert(babylon.parse(code, parserOptions), null))
    .program.body;
}
