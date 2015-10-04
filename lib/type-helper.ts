/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as types from './types';

export function convert(node: any, parent: types.Node<any>): types.Node<any> {
  if (node === null) {
    return null;
  } else if (isRestElement(node)) {
    return new types.RestElement(node, parent);
  } else if (isFile(node)) {
    return new types.File(node, null);
  } else if (isProgram(node)) {
    return new types.Program(node, parent);
  } else if (isThrowStatement(node)) {
    return new types.ThrowStatement(node, parent);
  } else if (isBreakStatement(node)) {
    return new types.BreakStatement(node, parent);
  } else if (isSwitchStatement(node)) {
    return new types.SwitchStatement(node, parent);
  } else if (isSwitchCase(node)) {
    return  new types.SwitchCase(node, parent);
  } else if (isIfStatement(node)) {
    return new types.IfStatement(node, parent);
  } else if (isImportDeclaration(node)) {
    return new types.ImportDeclaration(node, parent);
  } else if (isImportDefaultSpecifier(node)) {
    return new types.ImportDefaultSpecifier(node);
  } else if (isImportNamespaceSpecifier(node)) {
    return new types.ImportNamespaceSpecifier(node, parent);
  } else if (isImportSpecifier(node)) {
    return new types.ImportSpecifier(node, parent);
  } else if (isExportDefaultDeclaration(node)) {
    return new types.ExportDefaultDeclaration(node, parent);
  } else if (isExportNamedDeclaration(node)) {
    return new types.ExportNamedDeclaration(node, parent);
  } else if (isFunctionExpression(node)) {
    return new types.FunctionExpression(node, parent);
  } else if (isArrowFunctionExpression(node)) {
    return new types.ArrowFunctionExpression(node);
  } else if (isFunctionDeclaration(node)) {
    return new types.FunctionDeclaration(node, parent);
  } else if (isBlockStatement(node)) {
    return new types.BlockStatement(node, parent);
  } else if (isExpressionStatement(node)) {
    return new types.ExpressionStatement(node, parent);
  } else if (isSequenceExpression(node)) {
    return new types.SequenceExpression(node, parent);
  } else if (isCallExpression(node)) {
    return new types.CallExpression(node, parent);
  } else if (isMemberExpression(node)) {
    return new types.MemberExpression(node, parent);
  } else if (isIdentifier(node)) {
    return new types.Identifier(node, parent);
  } else if (isLiteral(node)) {
    return new types.Literal(node, parent);
  } else if (isReturnStatement(node)) {
    return new types.ReturnStatement(node, parent);
  } else if (isThisExpression(node)) {
    return new types.ThisExpression(node, parent);
  } else if (isNewExpression(node)) {
    return new types.NewExpression(node, parent);
  } else if (isObjectExpression(node)) {
    return new types.ObjectExpression(node, parent);
  } else if (isProperty(node)) {
    return new types.Property(node, parent);
  } else if (isUnaryExpression(node)) {
    return new types.UnaryExpression(node, parent);
  } else if (isUpdateExpression(node)) {
    return new types.UpdateExpression(node, parent);
  } else if (isConditionalExpression(node)) {
    return new types.ConditionalExpression(node, parent);
  } else if (isLogicalExpression(node)) {
    return new types.LogicalExpression(node, parent);
  } else if (isBinaryExpression(node)) {
    return new types.BinaryExpression(node, parent);
  } else if (isVariableDeclaration(node)) {
    return new types.VariableDeclaration(node, parent);
  } else if (isVariableDeclarator(node)) {
    return new types.VariableDeclarator(node, parent);
  } else if (isArrayExpression(node)) {
    return new types.ArrayExpression(node, parent);
  } else if (isForStatement(node)) {
    return new types.ForStatement(node, parent);
  } else if (isForOfStatement(node)) {
    return new types.ForOfStatement(node, parent);
  } else if (isAssignmentExpression(node)) {
    return new types.AssignmentExpression(node, parent);
  } else if (isTemplateLiteral(node)) {
    return new types.TemplateLiteral(node, parent);
  } else if (isTemplateElement(node)) {
    return new types.TemplateElement(node, parent);
  }
  console.error(node);
  throw new Error(`Unknown type to convert ${node.type}`)
}

function isRestElement(node: any): node is babylon.RestElement {
  return node.type == 'RestElement';
}

function isFile(node: any): node is babylon.File {
  return node.type == 'File';
}

function isProgram(node: any): node is babylon.Program {
  return node.type == 'Program';
}

function isThrowStatement(node: any): node is babylon.ThrowStatement {
  return node.type == 'ThrowStatement';
}

function isBreakStatement(node: any): node is babylon.BreakStatement {
  return node.type == 'BreakStatement';
}

function isSwitchStatement(node: any): node is babylon.SwitchStatement {
  return node.type == 'SwitchStatement';
}

function isSwitchCase(node: any): node is babylon.SwitchCase {
  return node.type == 'SwitchCase';
}

function isIfStatement(node: any): node is babylon.IfStatement {
  return node.type == 'IfStatement';
}

function isImportDeclaration(node: any): node is babylon.ImportDeclaration {
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

function isImportNamespaceSpecifier(node: any): node is babylon.ImportNamespaceSpecifier {
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

function isImportDefaultSpecifier(node: any): node is babylon.ImportDefaultSpecifier {
  return node.type == 'ImportDefaultSpecifier';
}

function isImportSpecifier(node: any): node is babylon.ImportSpecifier {
  return node.type == 'ImportSpecifier';
}

function isExportDefaultDeclaration(node: any): node is babylon.ExportDefaultDeclaration {
  return node.type == 'ExportDefaultDeclaration';
}

function isExportNamedDeclaration(node: any): node is babylon.ExportNamedDeclaration {
  return node.type == 'ExportNamedDeclaration';
}

function isFunctionExpression(node: any): node is babylon.FunctionExpression {
  return node.type == 'FunctionExpression';
}

function isArrowFunctionExpression(node: any): node is babylon.ArrowFunctionExpression {
  return node.type == 'ArrowFunctionExpression';
}

function isFunctionDeclaration(node: any): node is babylon.FunctionDeclaration {
  return node.type == 'FunctionDeclaration';
}

function isBlockStatement(node: any): node is babylon.BlockStatement {
  return node.type == 'BlockStatement';
}

function isExpressionStatement(node: any): node is babylon.ExpressionStatement {
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

function isCallExpression(node: any): node is babylon.CallExpression {
  return node.type == 'CallExpression';
}

function isMemberExpression(node: any): node is babylon.MemberExpression {
  return node.type == 'MemberExpression';
}

function isLiteral(node: any): node is babylon.Literal {
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

function isIdentifier(node: any): node is babylon.Identifier {
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

function isReturnStatement(node: any): node is babylon.ReturnStatement {
  return node.type == 'ReturnStatement';
}

function isThisExpression(node: any): node is babylon.ThisExpression {
  return node.type == 'ThisExpression';
}

function isNewExpression(node: any): node is babylon.NewExpression {
  return node.type == 'NewExpression';
}

function isObjectExpression(node: any): node is babylon.ObjectExpression {
  return node.type == 'ObjectExpression';
}

function isProperty(node: any): node is babylon.Property {
  return node.type == 'Property';
}

function isUnaryExpression(node: any): node is babylon.UnaryExpression {
  return node.type == 'UnaryExpression';
}

function isUpdateExpression(node: any): node is babylon.UpdateExpression {
  return node.type == 'UpdateExpression';
}

function isConditionalExpression(node: any): node is babylon.ConditionalExpression {
  return node.type == 'ConditionalExpression';
}

function isLogicalExpression(node: any): node is babylon.LogicalExpression {
  return node.type == 'LogicalExpression';
}

function isBinaryExpression(node: any): node is babylon.BinaryExpression {
  return node.type == 'BinaryExpression';
}

function isSequenceExpression(node: any): node is babylon.SequenceExpression {
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

function isVariableDeclaration(node: any): node is babylon.VariableDeclaration {
  return node.type == 'VariableDeclaration';
}

function isVariableDeclarator(node: any): node is babylon.VariableDeclarator {
  return node.type == 'VariableDeclarator';
}

function isArrayExpression(node: any): node is babylon.ArrayExpression {
  return node.type == 'ArrayExpression';
}

function isForStatement(node: any): node is babylon.ForStatement {
  return node.type == 'ForStatement';
}

function isForOfStatement(node: any): node is babylon.ForOfStatement {
  return node.type == 'ForOfStatement';
}

function isAssignmentExpression(node: any): node is babylon.AssignmentExpression {
  return node.type == 'AssignmentExpression';
}

function isTemplateLiteral(node: any): node is babylon.TemplateLiteral {
  return node.type == 'TemplateLiteral';
}

function isTemplateElement(node: any): node is babylon.TemplateElement {
  return node.type == 'TemplateElement';
}
