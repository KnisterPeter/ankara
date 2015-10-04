/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as types from './types';

export function convert(node: babylon.Node, parent: types.Node<any>): types.Node<any> {
  if (node === null) {
    return null;
  }
  const constructor = types[node.type];
  if (constructor) {
    return new constructor(node, parent);
  }
  console.error(node);
  throw new Error(`Unknown type to convert ${node.type}`)
}

export function importDeclaration(specifiers: types.ImportNamespaceSpecifier[], source: types.Literal) {
  return new types.ImportDeclaration({
    type: 'ImportDeclaration',
    start: undefined,
    end: undefined,
    loc: undefined,
    importKind: 'value',
    specifiers: specifiers.map(specifier => specifier.raw),
    source: source.raw
  });
}

export function importNamespaceSpecifier(local: types.Identifier) {
  return new types.ImportNamespaceSpecifier({
    type: 'ImportNamespaceSpecifier',
    start: undefined,
    end: undefined,
    loc: undefined,
    local: local.raw
  });
}

export function expressionStatement(expression: types.Expression<any>) {
  return new types.ExpressionStatement({
    type: 'ExpressionStatement',
    start: undefined,
    end: undefined,
    loc: undefined,
    expression: expression.raw
  });
}

export function literal(value: string|number) {
  return new types.Literal({
    type: 'Literal',
    start: undefined,
    end: undefined,
    loc: undefined,
    value,
    rawValue: value,
    raw: '' + value
  });
}

export function identifier(name: string) {
  return new types.Identifier({
    type: 'Identifier',
    start: undefined,
    end: undefined,
    loc: undefined,
    name
  });
}

export function sequenceExpression(expressions: types.Expression<any>[]) {
  return new types.SequenceExpression({
    type: 'SequenceExpression',
    start: undefined,
    end: undefined,
    loc: undefined,
    expressions: expressions.map(expression => expression.raw)
  });
}
