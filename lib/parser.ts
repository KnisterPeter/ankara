/// <reference path="../typings/references.d.ts" />
import * as types from './types';
import {readFileSync} from 'fs';
import * as babylon from 'babylon';
import {convert} from './type-helper';

export function parse(file: string): types.File {
  let code = readFileSync(file).toString();
  let ast = babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  });
  return <types.File>convert(ast, null)
}

export function parseFragment(code: string): types.Node<any>|types.Node<any>[] {
  return (<types.File>convert(babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  }), null)).program.body;
}
