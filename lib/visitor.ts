import * as types from './types';
import * as th from './type-helper';

export function traverse(node: types.Node<any>, fn: (node: types.Node<any>) => void): void {
  fn(node);
  if (node instanceof types.RestElement) {
    traverse(node.argument, fn);
  } else if (node instanceof types.File) {
    traverse(node.program, fn);
  } else if (node instanceof types.Program) {
    node.body.forEach(statement => traverse(statement, fn));
  } else if (node instanceof types.ThrowStatement) {
    traverse(node.argument, fn);
  } else if (node instanceof types.BreakStatement) {
    if (node.label) {
      traverse(node.label, fn);
    }
  } else if (node instanceof types.SwitchStatement) {
    traverse(node.discriminant, fn);
    node.cases.forEach(_case => traverse(_case, fn));
  } else if (node instanceof types.SwitchCase) {
    if (node.test) {
      traverse(node.test, fn);
    }
    node.consequent.forEach(consequent => traverse(consequent, fn));
  } else if (node instanceof types.IfStatement) {
    traverse(node.test, fn);
    traverse(node.consequent, fn);
    if (node.alternate) {
      traverse(node.alternate, fn);
    }
  } else if (node instanceof types.ImportDeclaration) {
    node.specifiers.forEach(specifier => traverse(specifier, fn));
    traverse(node.source, fn);
  } else if (node instanceof types.ImportDefaultSpecifier) {
    traverse(node.local, fn);
  } else if (node instanceof types.ImportNamespaceSpecifier) {
    traverse(node.local, fn);
  } else if (node instanceof types.ImportSpecifier) {
    traverse(node.imported, fn);
    traverse(node.local, fn);
  } else if (node instanceof types.ExportDefaultDeclaration) {
    traverse(node.declaration, fn);
  } else if (node instanceof types.ExportNamedDeclaration) {
    traverse(node.declaration, fn);
  } else if (node instanceof types.FunctionExpression) {
    node.id && traverse(node.id, fn);
    node.params.forEach(param => traverse(param, fn));
    traverse(node.body, fn);
  } else if (node instanceof types.ArrowFunctionExpression) {
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
  } else if (node instanceof types.ThisExpression) {
    // Nothing to do
  } else if (node instanceof types.NewExpression) {
    traverse(node.callee, fn);
    node.arguments.forEach(argument => traverse(argument, fn));
  } else if (node instanceof types.ObjectExpression) {
    node.properties.forEach(property => traverse(property, fn));
  } else if (node instanceof types.Property) {
    traverse(node.key, fn);
    traverse(node.value, fn);
  } else if (node instanceof types.UnaryExpression) {
    traverse(node.argument, fn);
  } else if (node instanceof types.UpdateExpression) {
    traverse(node.argument, fn);
  } else if (node instanceof types.ConditionalExpression) {
    traverse(node.test, fn);
    traverse(node.consequent, fn);
    traverse(node.alternate, fn);
  } else if (node instanceof types.LogicalExpression) {
    traverse(node.left, fn);
    traverse(node.right, fn);
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
  } else if (node instanceof types.ForStatement) {
    traverse(node.init, fn);
    traverse(node.test, fn);
    traverse(node.update, fn);
    traverse(node.body, fn);
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
