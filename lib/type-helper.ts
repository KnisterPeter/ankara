/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as types from './types';
import * as th from './type-helper';

export function convert(node: any): types.Node {
  if (th.isFile(node)) {
    return new types.File(node);
  } else if (th.isProgram(node)) {
    return new types.Program(node);
  } else if (th.isImportDeclaration(node)) {
    return new types.ImportDeclaration(node);
  } else if (th.isImportNamespaceSpecifier(node)) {
    return new types.ImportNamespaceSpecifier(node);
  } else if (th.isExportDefaultDeclaration(node)) {
    return new types.ExportDefaultDeclaration(node);
  } else if (th.isExportNamedDeclaration(node)) {
    return new types.ExportNamedDeclaration(node);
  } else if (th.isFunctionExpression(node)) {
    return new types.FunctionExpression(node);
  } else if (th.isFunctionDeclaration(node)) {
    return new types.FunctionDeclaration(node);
  } else if (th.isBlockStatement(node)) {
    return new types.BlockStatement(node);
  } else if (th.isExpressionStatement(node)) {
    return new types.ExpressionStatement(node);
  } else if (th.isSequenceExpression(node)) {
    return new types.SequenceExpression(node);
  } else if (th.isCallExpression(node)) {
    return new types.CallExpression(node);
  } else if (th.isMemberExpression(node)) {
    return new types.MemberExpression(node);
  } else if (th.isIdentifier(node)) {
    return new types.Identifier(node);
  } else if (th.isLiteral(node)) {
    return new types.Literal(node);
  } else if (th.isReturnStatement(node)) {
    return new types.ReturnStatement(node);
  } else if (th.isBinaryExpression(node)) {
    return new types.BinaryExpression(node);
  } else if (th.isVariableDeclaration(node)) {
    return new types.VariableDeclaration(node);
  } else if (th.isVariableDeclarator(node)) {
    return new types.VariableDeclarator(node);
  } else if (th.isArrayExpression(node)) {
    return new types.ArrayExpression(node);
  } else if (th.isForOfStatement(node)) {
    return new types.ForOfStatement(node);
  } else if (th.isAssignmentExpression(node)) {
    return new types.AssignmentExpression(node);
  } else if (th.isTemplateLiteral(node)) {
    return new types.TemplateLiteral(node);
  } else if (th.isTemplateElement(node)) {
    return new types.TemplateElement(node);
  }
  console.error(node);
  throw new Error(`Unknown type to traverse ${node.type}`)
}


export function isStatement(node: any): node is types.Statement {
  return isExpressionStatement(node) || isReturnStatement(node);
}

export function isFile(node: any): node is types.File {
  return node.type == 'File';
}

export function isProgram(node: any): node is types.Program {
  return node.type == 'Program';
}

export function isImportDeclaration(node: any): node is types.ImportDeclaration {
  return node.type == 'ImportDeclaration';
}

export function importDeclaration(specifiers: types.ImportNamespaceSpecifier[], source: any): types.ImportDeclaration {
  return {
    type: 'ImportDeclaration',
    start: undefined,
    end: undefined,
    loc: undefined,
    importKind: 'value',
    specifiers,
    source
  };
}

export function isImportNamespaceSpecifier(node: any): node is types.ImportNamespaceSpecifier {
  return node.type == 'ImportNamespaceSpecifier';
}

export function importNamespaceSpecifier(local: any): types.ImportNamespaceSpecifier {
  return {
    type: 'ImportNamespaceSpecifier',
    start: undefined,
    end: undefined,
    loc: undefined,
    local
  };
}

export function isExportDefaultDeclaration(node: any): node is types.ExportDefaultDeclaration {
  return node.type == 'ExportDefaultDeclaration';
}

export function isExportNamedDeclaration(node: any): node is types.ExportNamedDeclaration {
  return node.type == 'ExportNamedDeclaration';
}

export function isFunctionExpression(node: any): node is types.FunctionExpression {
  return node.type == 'FunctionExpression';
}

export function isFunctionDeclaration(node: any): node is types.FunctionDeclaration {
  return node.type == 'FunctionDeclaration';
}

export function isBlockStatement(node: any): node is types.BlockStatement {
  return node.type == 'BlockStatement';
}

export function isExpressionStatement(node: any): node is types.ExpressionStatement {
  return node.type == 'ExpressionStatement';
}

export function isCallExpression(node: any): node is types.CallExpression {
  return node.type == 'CallExpression';
}

export function isMemberExpression(node: any): node is types.MemberExpression {
  return node.type == 'MemberExpression';
}

export function isLiteral(node: any): node is types.Literal {
  return node.type == 'Literal';
}

export function literal(value: string): types.Literal {
  return {
    type: 'Literal',
    start: undefined,
    end: undefined,
    loc: undefined,
    value,
    rawValue: value,
    raw: value
  };
}

export function isIdentifier(node: any): node is types.Identifier {
  return node.type == 'Identifier';
}

export function identifier(name: string): types.Identifier {
  return {
    type: 'Identifier',
    start: undefined,
    end: undefined,
    loc: undefined,
    name
  };
}

export function isReturnStatement(node: any): node is types.ReturnStatement {
  return node.type == 'ReturnStatement';
}

export function isBinaryExpression(node: any): node is types.BinaryExpression {
  return node.type == 'BinaryExpression';
}

export function isSequenceExpression(node: any): node is types.SequenceExpression {
  return node.type == 'SequenceExpression';
}

export function isVariableDeclaration(node: any): node is types.VariableDeclaration {
  return node.type == 'VariableDeclaration';
}

export function isVariableDeclarator(node: any): node is types.VariableDeclarator {
  return node.type == 'VariableDeclarator';
}

export function isArrayExpression(node: any): node is types.ArrayExpression {
  return node.type == 'ArrayExpression';
}

export function isForOfStatement(node: any): node is types.ForOfStatement {
  return node.type == 'ForOfStatement';
}

export function isAssignmentExpression(node: any): node is types.AssignmentExpression {
  return node.type == 'AssignmentExpression';
}

export function isTemplateLiteral(node: any): node is types.TemplateLiteral {
  return node.type == 'TemplateLiteral';
}

export function isTemplateElement(node: any): node is types.TemplateElement {
  return node.type == 'TemplateElement';
}
