/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as type from './type-helper';

export default function toJavaScript(ast: babylon.File): string {
  return ast.program.body.map(statement => generateCode(statement)).join('\n');
}

function generateCode(node: babylon.Node): string {
  if (type.isImportDeclaration(node)) {
    return `import ${node.specifiers.map(specifier => generateCode(specifier)).join(' ')} from ${generateCode(node.source)}\n`;
  } else if (type.isImportNamespaceSpecifier(node)) {
    return `* as ${generateCode(node.local)}`;
  } else if (type.isExportDefaultDeclaration(node)) {
    return `export default ${generateCode(node.declaration)}\n`;
  } else if (type.isExportNamedDeclaration(node)) {
    return `export ${generateCode(node.declaration)}\n`;
  } else if (type.isBlockStatement(node)) {
    return `{\n${node.body.map(statement => generateCode(statement)).join('\n')}}\n`;
  } else if (type.isExpressionStatement(node)) {
    return `${generateCode(node.expression)};\n`;
  } else if (type.isFunctionExpression(node)) {
    return `function${node.generator ? '*' : ''} ${node.id ? generateCode(node.id) : ''}(${node.params.map(param => generateCode(param)).join(', ')}) ${generateCode(node.body)}`;
  } else if (type.isFunctionDeclaration(node)) {
    return `function${node.generator ? '*' : ''} ${node.id ? generateCode(node.id) : ''}(${node.params.map(param => generateCode(param)).join(', ')}) ${generateCode(node.body)}`;
  } else if (type.isSequenceExpression(node)) {
    return `(${node.expressions.map(expression => generateCode(expression)).join(', ')})`;
  } else if (type.isCallExpression(node)) {
    return `${generateCode(node.callee)}(${node.arguments.map(arg => generateCode(arg)).join(', ')})`;
  } else if (type.isLiteral(node)) {
    console.log(node);
    let str;
    if (typeof node.value == 'string') {
      str = `'${(node.value as string).replace(/'/g, '\'')}'`;
    } else {
      str = node.value;
    }
    return str;
  } else if (type.isMemberExpression(node)) {
    return `${generateCode(node.object)}.${generateCode(node.property)}`;
  } else if (type.isIdentifier(node)) {
    return node.name;
  } else if (type.isReturnStatement(node)) {
    return `return ${node.argument ? generateCode(node.argument) : ''};\n`;
  } else if (type.isBinaryExpression(node)) {
    return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;
  } else if (type.isVariableDeclaration(node)) {
    return `${node.kind} ${node.declarations.map(declaration => generateCode(declaration)).join(', ')}`;
  } else if (type.isVariableDeclarator(node)) {
    return `${generateCode(node.id)}${node.init != null ? ` = ${generateCode(node.init)}` : ''}`;
  } else if (type.isArrayExpression(node)) {
    return `[${node.elements.map(element => generateCode(element)).join(', ')}]`;
  } else if (type.isForOfStatement(node)) {
    return `for (${generateCode(node.left)} of ${generateCode(node.right)}) ${generateCode(node.body)}\n`;
  } else if (type.isAssignmentExpression(node)) {
    return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;
  } else if (type.isTemplateLiteral(node)) {
    return '`' + ([].concat(node.quasis, node.expressions) as babylon.Node[])
      .sort((a, b) => a.start - b.start)
      .map(node => {
        if (!type.isTemplateElement(node)) {
        return '${' + generateCode(node) + '}';
        }
        return generateCode(node);
      })
      .join('') + '`';
  } else if (type.isTemplateElement(node)) {
    return node.value.raw;
  }
  console.error(node);
  throw new Error(`Unknown node type ${node.type} to generate code for`);
}
