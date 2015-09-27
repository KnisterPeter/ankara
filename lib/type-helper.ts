/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as types from './types';
import * as th from './type-helper';

export function convert(node: any, parent: types.Node<any>): types.Node<any> {
  if (node === null) {
    return null;
  } else if (th.isFile(node)) {
    return new types.File(node, null);
  } else if (th.isProgram(node)) {
    return new types.Program(node, parent);
  } else if (th.isImportDeclaration(node)) {
    return new types.ImportDeclaration(node, parent);
  } else if (th.isImportNamespaceSpecifier(node)) {
    return new types.ImportNamespaceSpecifier(node, parent);
  } else if (th.isImportSpecifier(node)) {
    return new types.ImportSpecifier(node, parent);
  } else if (th.isExportDefaultDeclaration(node)) {
    return new types.ExportDefaultDeclaration(node, parent);
  } else if (th.isExportNamedDeclaration(node)) {
    return new types.ExportNamedDeclaration(node, parent);
  } else if (th.isFunctionExpression(node)) {
    return new types.FunctionExpression(node, parent);
  } else if (th.isFunctionDeclaration(node)) {
    return new types.FunctionDeclaration(node, parent);
  } else if (th.isBlockStatement(node)) {
    return new types.BlockStatement(node, parent);
  } else if (th.isExpressionStatement(node)) {
    return new types.ExpressionStatement(node, parent);
  } else if (th.isSequenceExpression(node)) {
    return new types.SequenceExpression(node, parent);
  } else if (th.isCallExpression(node)) {
    return new types.CallExpression(node, parent);
  } else if (th.isMemberExpression(node)) {
    return new types.MemberExpression(node, parent);
  } else if (th.isIdentifier(node)) {
    return new types.Identifier(node, parent);
  } else if (th.isLiteral(node)) {
    return new types.Literal(node, parent);
  } else if (th.isReturnStatement(node)) {
    return new types.ReturnStatement(node, parent);
  } else if (th.isBinaryExpression(node)) {
    return new types.BinaryExpression(node, parent);
  } else if (th.isVariableDeclaration(node)) {
    return new types.VariableDeclaration(node, parent);
  } else if (th.isVariableDeclarator(node)) {
    return new types.VariableDeclarator(node, parent);
  } else if (th.isArrayExpression(node)) {
    return new types.ArrayExpression(node, parent);
  } else if (th.isForOfStatement(node)) {
    return new types.ForOfStatement(node, parent);
  } else if (th.isAssignmentExpression(node)) {
    return new types.AssignmentExpression(node, parent);
  } else if (th.isTemplateLiteral(node)) {
    return new types.TemplateLiteral(node, parent);
  } else if (th.isTemplateElement(node)) {
    return new types.TemplateElement(node, parent);
  }
  console.error(node);
  throw new Error(`Unknown type to traverse ${node.type}`)
}

export function isFile(node: any): node is babylon.File {
  return node.type == 'File';
}

export function isProgram(node: any): node is babylon.Program {
  return node.type == 'Program';
}

export function isImportDeclaration(node: any): node is babylon.ImportDeclaration {
  return node.type == 'ImportDeclaration';
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

export function isImportNamespaceSpecifier(node: any): node is babylon.ImportNamespaceSpecifier {
  return node.type == 'ImportNamespaceSpecifier';
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

export function isImportSpecifier(node: any): node is babylon.ImportSpecifier {
  return node.type == 'ImportSpecifier';
}

export function isExportDefaultDeclaration(node: any): node is babylon.ExportDefaultDeclaration {
  return node.type == 'ExportDefaultDeclaration';
}

export function isExportNamedDeclaration(node: any): node is babylon.ExportNamedDeclaration {
  return node.type == 'ExportNamedDeclaration';
}

export function isFunctionExpression(node: any): node is babylon.FunctionExpression {
  return node.type == 'FunctionExpression';
}

export function isFunctionDeclaration(node: any): node is babylon.FunctionDeclaration {
  return node.type == 'FunctionDeclaration';
}

export function isBlockStatement(node: any): node is babylon.BlockStatement {
  return node.type == 'BlockStatement';
}

export function isExpressionStatement(node: any): node is babylon.ExpressionStatement {
  return node.type == 'ExpressionStatement';
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

export function isCallExpression(node: any): node is babylon.CallExpression {
  return node.type == 'CallExpression';
}

export function isMemberExpression(node: any): node is babylon.MemberExpression {
  return node.type == 'MemberExpression';
}

export function isLiteral(node: any): node is babylon.Literal {
  return node.type == 'Literal';
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

export function isIdentifier(node: any): node is babylon.Identifier {
  return node.type == 'Identifier';
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

export function isReturnStatement(node: any): node is babylon.ReturnStatement {
  return node.type == 'ReturnStatement';
}

export function isBinaryExpression(node: any): node is babylon.BinaryExpression {
  return node.type == 'BinaryExpression';
}

export function isSequenceExpression(node: any): node is babylon.SequenceExpression {
  return node.type == 'SequenceExpression';
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

export function isVariableDeclaration(node: any): node is babylon.VariableDeclaration {
  return node.type == 'VariableDeclaration';
}

export function isVariableDeclarator(node: any): node is babylon.VariableDeclarator {
  return node.type == 'VariableDeclarator';
}

export function isArrayExpression(node: any): node is babylon.ArrayExpression {
  return node.type == 'ArrayExpression';
}

export function isForOfStatement(node: any): node is babylon.ForOfStatement {
  return node.type == 'ForOfStatement';
}

export function isAssignmentExpression(node: any): node is babylon.AssignmentExpression {
  return node.type == 'AssignmentExpression';
}

export function isTemplateLiteral(node: any): node is babylon.TemplateLiteral {
  return node.type == 'TemplateLiteral';
}

export function isTemplateElement(node: any): node is babylon.TemplateElement {
  return node.type == 'TemplateElement';
}
