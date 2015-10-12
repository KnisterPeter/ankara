/// <reference path="../typings/references.d.ts" />
import {readFileSync} from 'fs';
import * as babylon from 'babylon';
import {convert} from './type-helper';
import {File} from './types/file';
import {Node} from './types/node';

export function parse(file: string): File {
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
  return <File>convert(ast, null)
}

export function parseFragment(code: string): Node<any>[] {
  return (<File>convert(babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  }), null)).program.body;
}
