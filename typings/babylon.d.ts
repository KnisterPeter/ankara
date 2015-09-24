declare module 'babylon' {
  export function parse(code: string, options: any): File;

  export abstract class Node {
    type: string;
    start: number;
    end: number;
    loc: any;
  }
  
  export class File extends Node {
    program: Program;
  }
  
  export class Program extends Node {
    sourceType: string;
    body: Statement[];
  }
  
  export abstract class Statement extends Node {
  }
  
  export class ImportDeclaration extends Statement {
    importKind: string;
    specifiers: ImportNamespaceSpecifier[];
    source: Node;
  }
  
  export class ImportNamespaceSpecifier extends Node {
    local: Node;
  }
  
  export class ExportDefaultDeclaration extends Statement {
    declaration: Expression;
  }
  
  export class ExportNamedDeclaration extends Statement {
    specifiers: Node[];
    source: any;
    declaration: Node;
  }
  
  export class BlockStatement extends Statement {
    body: Statement[];
  }
  
  export class ExpressionStatement extends Statement {
    expression: Expression;
  }
  
  export class ReturnStatement extends Statement {
    argument: Expression;
  }
  
  export class VariableDeclaration extends Statement {
    kind: string;
    declarations: VariableDeclarator[];
  }
  
  export class VariableDeclarator extends Node {
    id: Identifier;
    init: Expression;
  }
  
  export class ForOfStatement extends Statement {
    left: Node;
    right: Node;
    body: Statement;
  }
  
  export abstract class Expression extends Node {
  }
  
  export class AssignmentExpression extends Expression {
    operator: string;
    left: Node;
    right: Expression;
  }
  
  export class ArrayExpression extends Expression {
    elements: Expression[];
  }
  
  export class SequenceExpression extends Expression {
    expressions: Expression[];
  }
  
  export class BinaryExpression extends Expression {
    operator: string;
    left: Expression;
    right: Expression;
  }
  
  export class FunctionExpression extends Expression {
    id: Node;
    generator: boolean;
    expression: boolean;
    params: any[];
    body: BlockStatement;
  }
  
  export class FunctionDeclaration extends Expression {
    id: Node;
    generator: boolean;
    expression: boolean;
    params: any[];
    body: BlockStatement;
  }
  
  export class CallExpression extends Expression {
    callee: Expression;
    arguments: any[];
  }
  
  export class MemberExpression extends Expression {
    object: Node;
    property: Node;
  }
  
  export class Literal extends Expression {
    value: string|number;
    rawValue: string|number;
    raw: string;
  }
  
  export class TemplateLiteral extends Expression {
    expressions: Expression[];
    quasis: TemplateElement[];
  }
  
  export class TemplateElement extends Node {
    value: { raw: string; cooked: string };
    tail: boolean;
  }
  
  export class Identifier extends Expression {
    name: string;
  }
}
