import * as types from './types';
import * as th from './type-helper';

export function traverse(node: types.Node<any>, fn: (node: types.Node<any>) => void): void {
  fn(node);
  if (node instanceof types.File) {
    traverse(node.program, fn);
  } else if (node instanceof types.Program) {
    node.body.forEach(statement => traverse(statement, fn));
  } else if (node instanceof types.ImportDeclaration) {
    node.specifiers.forEach(specifier => traverse(specifier, fn));
    traverse(node.source, fn);
  } else if (node instanceof types.ImportNamespaceSpecifier) {
    traverse(node.local, fn);
  } else if (node instanceof types.ExportDefaultDeclaration) {
    traverse(node.declaration, fn);
  } else if (node instanceof types.ExportNamedDeclaration) {
    traverse(node.declaration, fn);
  } else if (node instanceof types.FunctionExpression) {
    node.id && traverse(node.id, fn);
    node.params.forEach(param => traverse(param, fn));
    traverse(node.body, fn);
  } else if (node instanceof types.FunctionDeclaration) {
    node.id && traverse(node.id, fn);
    node.params.forEach(param => traverse(param, fn));
    traverse(node.body, fn);
  } else if (node instanceof types.BlockStatement) {
    node.body.forEach(statement => traverse(statement, fn));
  } else if (node instanceof types.ExpressionStatement) {
    traverse(node.expression, fn);
  } else if (node instanceof types.SequenceExpression) {
    node.expressions.forEach(expression => traverse(expression, fn));
  } else if (node instanceof types.CallExpression) {
    traverse(node.callee, fn);
    node.arguments.forEach(arg => traverse(arg, fn));
  } else if (node instanceof types.MemberExpression) {
    traverse(node.object, fn);
    traverse(node.property, fn);
  } else if (node instanceof types.Identifier) {
    // TODO:...
  } else if (node instanceof types.Literal) {
    // TODO:...
  } else if (node instanceof types.ReturnStatement) {
    node.argument && traverse(node.argument, fn);
  } else if (node instanceof types.BinaryExpression) {
    traverse(node.left, fn);
    traverse(node.right, fn);
  } else if (node instanceof types.VariableDeclaration) {
    node.declarations.forEach(declaration => traverse(declaration, fn));
  } else if (node instanceof types.VariableDeclarator) {
    traverse(node.id, fn);
    if (node.init != null) {
      traverse(node.init, fn);
    }
  } else if (node instanceof types.ArrayExpression) {
    node.elements.forEach(element => traverse(element, fn));
  } else if (node instanceof types.ForOfStatement) {
    traverse(node.left, fn);
    traverse(node.right, fn);
    traverse(node.body, fn);
  } else if (node instanceof types.AssignmentExpression) {
    traverse(node.left, fn);
    traverse(node.right, fn);
  } else if (node instanceof types.TemplateLiteral) {
    [].concat(node.quasis, node.expressions)
      .sort((a, b) => a.start - b.start)
      .forEach(node => traverse(node, fn));
  } else if (node instanceof types.TemplateElement) {
    // TODO:...
  } else {
    console.error(node);
    throw new Error(`Unknown type to traverse ${node.raw.type}`)
  }
}
