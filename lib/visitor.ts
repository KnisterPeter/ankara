import * as babylon from 'babylon';
import * as types from './types';
import * as th from './type-helper';

export function traverse(node: types.Node, fn: (node: types.Node) => void): void {
  fn(node);
  switch (typeof node) {
    case 'types.File':
      console.log('FILE!!!');
      asdf;
      break;
    default:
      console.log('OTHER...');
      asdf;
      break;
  }
}

export function traverse2(node: babylon.Node, fn: (node: babylon.Node) => void): void {
  fn(node);
  if (th.isFile(node)) {
    traverse2(node.program, fn);
  } else if (th.isProgram(node)) {
    node.body.forEach(statement => traverse2(statement, fn));
  } else if (th.isImportDeclaration(node)) {
    node.specifiers.forEach(specifier => traverse2(specifier, fn));
    traverse2(node.source, fn);
  } else if (th.isImportNamespaceSpecifier(node)) {
    traverse2(node.local, fn);
  } else if (th.isExportDefaultDeclaration(node)) {
    traverse2(node.declaration, fn);
  } else if (th.isExportNamedDeclaration(node)) {
    traverse2(node.declaration, fn);
  } else if (th.isFunctionExpression(node)) {
    node.id && traverse2(node.id, fn);
    node.params.forEach(param => traverse2(param, fn));
    traverse2(node.body, fn);
  } else if (th.isFunctionDeclaration(node)) {
    node.id && traverse2(node.id, fn);
    node.params.forEach(param => traverse2(param, fn));
    traverse2(node.body, fn);
  } else if (th.isBlockStatement(node)) {
    node.body.forEach(statement => traverse2(statement, fn));
  } else if (th.isExpressionStatement(node)) {
    traverse2(node.expression, fn);
  } else if (th.isSequenceExpression(node)) {
    node.expressions.forEach(expression => traverse2(expression, fn));
  } else if (th.isCallExpression(node)) {
    traverse2(node.callee, fn);
    node.arguments.forEach(arg => traverse2(arg, fn));
  } else if (th.isMemberExpression(node)) {
    traverse2(node.object, fn);
    traverse2(node.property, fn);
  } else if (th.isIdentifier(node)) {
    // TODO:...
  } else if (th.isLiteral(node)) {
    // TODO:...
  } else if (th.isReturnStatement(node)) {
    node.argument && traverse2(node.argument, fn);
  } else if (th.isBinaryExpression(node)) {
    traverse2(node.left, fn);
    traverse2(node.right, fn);
  } else if (th.isVariableDeclaration(node)) {
    node.declarations.forEach(declaration => traverse2(declaration, fn));
  } else if (th.isVariableDeclarator(node)) {
    traverse2(node.id, fn);
    if (node.init != null) {
      traverse2(node.init, fn);
    }
  } else if (th.isArrayExpression(node)) {
    node.elements.forEach(element => traverse2(element, fn));
  } else if (th.isForOfStatement(node)) {
    traverse2(node.left, fn);
    traverse2(node.right, fn);
    traverse2(node.body, fn);
  } else if (th.isAssignmentExpression(node)) {
    traverse2(node.left, fn);
    traverse2(node.right, fn);
  } else if (th.isTemplateLiteral(node)) {
    ([].concat(node.quasis, node.expressions) as babylon.Node[])
      .sort((a, b) => a.start - b.start)
      .forEach(node => traverse2(node, fn));
  } else if (th.isTemplateElement(node)) {
    // TODO:...
  } else {
    console.error(node);
    throw new Error(`Unknown type to traverse ${node.type}`)
  }
}
