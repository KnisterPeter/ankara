/// <reference path="../typings/references.d.ts" />
import * as path from 'path';
import * as fs from 'fs';
import * as babylon from 'babylon';
import './cover';
import * as types from './types';
import * as th from './type-helper';
import {traverse} from './visitor';
import toJavaScript from './code-generator';
import './register';

let devCover = path.join(__dirname, 'cover.js');
let devMode = fs.existsSync(devCover);

export function instrument(file: string): string {
  let ast = parse(file);
  let statements = [];
  traverse(ast, (node) => {
    if (node instanceof types.ExpressionStatement
        || node instanceof types.ReturnStatement
        || node instanceof types.VariableDeclaration) {
      statements.push(node.loc.start.line);
    }
  });
  traverse(ast, (node) => {
    if (node instanceof types.Program) {
      let coverLib = devMode ? devCover : 'ankara/dist/cover';
      let fragment = <types.ImportDeclaration>parseFragment(`
        import {cover as __$c} from '${coverLib}';
        __$c.init("${file}", [${statements}]);
      `);
      node.body[0].insertBefore(fragment);
    } else if (node instanceof types.ExpressionStatement) {
      // Guard of own code...
      const expression = node.expression;
      if (expression instanceof types.CallExpression) {
        let expression2: types.Node<any> = expression.callee;
        while (expression2 instanceof types.MemberExpression) {
          expression2 = (<types.MemberExpression>expression2).object;
        }
        if (expression2 instanceof types.Identifier) {
          if (expression2.name === '__$c') {
            return;
          }
        }
      }

      let fragment = <types.ExpressionStatement>parseFragment(`__$c.statement("${file}", ${node.loc.start.line})`)[0];
      node.replaceWith(
        th.expressionStatement(
          th.sequenceExpression([
            fragment.expression,
            node.expression
          ])
        )
      );
    } else if (node instanceof types.ReturnStatement) {
      let fragment = <types.ExpressionStatement>parseFragment(`__$c.statement("${file}", ${node.raw.loc.start.line})`)[0];
      node.argument.replaceWith(
        th.sequenceExpression([
          fragment.expression,
          node.argument
        ])
      );
    } else if (node instanceof types.VariableDeclaration) {
      let fragment = <types.ExpressionStatement>parseFragment(`__$c.statement("${file}", ${node.raw.loc.start.line})`)[0];
      if (node.parent instanceof types.ForOfStatement) {
        node.parent.insertBefore(fragment);
      } else {
        node.insertBefore(fragment);
      }
    }
  });
  return toJavaScript(ast);
}

function parse(file: string): types.File {
  let code = fs.readFileSync(file).toString();
  let ast = babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  });
  return <types.File>th.convert(ast, null)
}

function parseFragment(code: string): types.Node<any>|types.Node<any>[] {
  return (<types.File>th.convert(babylon.parse(code, {
    sourceType: "module",
    allowReserved: true,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    plugins: {
      flow: true
    }
  }), null)).program.body;
}
