/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as types from './types';
import * as th from './type-helper';

export default function toJavaScript(ast: types.Node<any>): string {
  return generateCode(ast);
}

// TODO: Resolve any node
function generateCode(node: types.Node<any>): string {
  if (node instanceof types.ArrayExpression) {
    return `[${node.elements.map(element => generateCode(element)).join(', ')}]`;
  } else if (node instanceof types.AssignmentExpression) {
    return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;
  } else if (node instanceof types.ObjectExpression) {
    return `{${node.properties.map(property => generateCode(property)).join(', ')}}`;
  } else if (node instanceof types.UnaryExpression) {
    return `${node.operator} ${generateCode(node.argument)}`;
  } else if (node instanceof types.LogicalExpression) {
    return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;
  } else if (node instanceof types.BinaryExpression) {
    return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;
  } else if (node instanceof types.BlockStatement) {
    return `{\n${node.body.map(statement => generateCode(statement)).join('\n')}}\n`;
  } else if (node instanceof types.CallExpression) {
    return `${generateCode(node.callee)}(${node.arguments.map(arg => generateCode(arg)).join(', ')})`;
  } else if (node instanceof types.ExportDefaultDeclaration) {
    return `export default ${generateCode(node.declaration)}\n`;
  } else if (node instanceof types.ExportNamedDeclaration) {
    return `export ${generateCode(node.declaration)}\n`;
  } else if (node instanceof types.ExpressionStatement) {
    return `${generateCode(node.expression)};\n`;
  } else if (node instanceof types.File) {
    return generateCode(node.program);
  } else if (node instanceof types.ForOfStatement) {
    return `for (${generateCode(node.left)} of ${generateCode(node.right)}) ${generateCode(node.body)}\n`;
  } else if (node instanceof types.FunctionDeclaration) {
    return `function${node.generator ? '*' : ''} ${node.id ? generateCode(node.id) : ''}(${node.params.map(param => generateCode(param)).join(', ')}) ${generateCode(node.body)}`;
  } else if (node instanceof types.FunctionExpression) {
    return `function${node.generator ? '*' : ''} ${node.id ? generateCode(node.id) : ''}(${node.params.map(param => generateCode(param)).join(', ')}) ${generateCode(node.body)}`;
  } else if (node instanceof types.ArrowFunctionExpression) {
    return `${node.generator ? '*' : ''}(${node.params.map(param => generateCode(param)).join(', ')}) => ${generateCode(node.body)}`;
  } else if (node instanceof types.Identifier) {
    return node.name;
  } else if (node instanceof types.ImportDeclaration) {
    let imports = [];
    let namedImports = node.specifiers
      .filter(specifier => specifier instanceof types.ImportSpecifier)
      .map(specifier => generateCode(specifier))
      .join(', ');
    if (namedImports) {
      imports.push(`{${namedImports}}`);
    }
    let otherImports = node.specifiers
      .filter(specifier => !(specifier instanceof types.ImportSpecifier))
      .map(specifier => generateCode(specifier))
      .join(', ');
    if (otherImports) {
      imports.push(otherImports);
    }
    return `import ${imports.join(', ')} from ${generateCode(node.source)};\n`;
  } else if (node instanceof types.ImportDefaultSpecifier) {
    return `${generateCode(node.local)}`;
  } else if (node instanceof types.ImportNamespaceSpecifier) {
    return `* as ${generateCode(node.local)}`;
  } else if (node instanceof types.ImportSpecifier) {
    if (node.imported.name == node.local.name) {
      return `${generateCode(node.imported)}`;
    }
    return `${generateCode(node.imported)} as ${generateCode(node.local)}`;
  } else if (node instanceof types.Literal) {
    let str = node.value;
    if (typeof str === 'string') {
      str = "'" + (<string>str).replace(/'/g, '\'') + "'";
    }
    return <string>str;
  } else if (node instanceof types.MemberExpression) {
    const property = node.property;
    if (!(property instanceof types.Identifier)) {
      return `${generateCode(node.object)}[${generateCode(property)}]`;
    }
    return `${generateCode(node.object)}.${generateCode(property)}`;
  } else if (node instanceof types.Program) {
    return node.body.map(statement => generateCode(statement)).join('\n');
  } else if (node instanceof types.ReturnStatement) {
    return `return ${node.argument ? generateCode(node.argument) : ''};\n`;
  } else if (node instanceof types.SequenceExpression) {
    return `(${node.expressions.map(expression => generateCode(expression)).join(', ')})`;
  } else if (node instanceof types.TemplateElement) {
    return node.value.raw;
  } else if (node instanceof types.TemplateLiteral) {
    return '`' + ([].concat(node.quasis, node.expressions))
      .sort((a, b) => a.start - b.start)
      .map(node => {
        if (!(node instanceof types.TemplateElement)) {
          return '${' + generateCode(node) + '}';
        }
        return generateCode(node);
      })
      .join('') + '`';
  } else if (node instanceof types.VariableDeclaration) {
    const isStatement = !(node.parent instanceof types.ForOfStatement);
    return `${node.kind} ${node.declarations.map(declaration => generateCode(declaration)).join(', ')}${isStatement ? ';': ''}`;
  } else if (node instanceof types.VariableDeclarator) {
    return `${generateCode(node.id)}${node.init != null ? ` = ${generateCode(node.init)}` : ''}`;
  }

  console.error(node);
  throw new Error(`Unknown node type ${node.raw.type} to generate code for`);
}
