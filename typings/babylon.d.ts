declare module 'babylon' {
  export function parse(code: string, options: any): File;

  export interface Position {
    line: number;
    column: number;
  }

  export interface SourceLocation {
    start: Position;
    end: Position;
  }

  export interface Node {
    type: string;
    start: number;
    end: number;
    loc: SourceLocation;
  }

  export interface File extends Node {
    program: Program;
  }

  export interface Program extends Node {
    sourceType: string;
    body: Statement[];
  }

  export interface Statement extends Node {
  }

  export interface ImportDeclaration extends Statement {
    importKind: string;
    specifiers: ImportNamespaceSpecifier[];
    source: Node;
  }

  export interface ImportDefaultSpecifier extends Node {
    local: Identifier;
  }

  export interface ImportNamespaceSpecifier extends Node {
    local: Node;
  }

  export interface ImportSpecifier extends Node {
    imported: Identifier;
    local:  Identifier;
  }
  
  export interface ExportDefaultDeclaration extends Statement {
    declaration: Expression;
  }
  
  export interface ExportNamedDeclaration extends Statement {
    specifiers: Node[];
    source: any;
    declaration: Node;
  }
  
  export interface BlockStatement extends Statement {
    body: Statement[];
  }
  
  export interface ExpressionStatement extends Statement {
    expression: Expression;
  }
  
  export interface ReturnStatement extends Statement {
    argument: Expression;
  }
  
  export interface VariableDeclaration extends Statement {
    kind: string;
    declarations: VariableDeclarator[];
  }
  
  export interface VariableDeclarator extends Node {
    id: Identifier;
    init: Expression;
  }
  
  export interface ForOfStatement extends Statement {
    left: Node;
    right: Node;
    body: Statement;
  }
  
  export interface Expression extends Node {
  }

  export interface AssignmentExpression extends Expression {
    operator: string;
    left: Node;
    right: Expression;
  }

  export interface ArrayExpression extends Expression {
    elements: Expression[];
  }

  export interface SequenceExpression extends Expression {
    expressions: Expression[];
  }

  export interface BinaryExpression extends Expression {
    operator: string;
    left: Expression;
    right: Expression;
  }

  export interface FunctionExpression extends Expression {
    id: Node;
    generator: boolean;
    expression: boolean;
    params: any[];
    body: BlockStatement;
  }

  export interface ArrowFunctionExpression extends Expression {
    id: Identifier;
    generator: boolean;
    expression: boolean;
    params: Identifier[];
    body: Statement;
  }

  export interface FunctionDeclaration extends Expression {
    id: Node;
    generator: boolean;
    expression: boolean;
    params: any[];
    body: BlockStatement;
  }

  export interface CallExpression extends Expression {
    callee: Expression;
    arguments: any[];
  }

  export interface MemberExpression extends Expression {
    object: Node;
    property: Node;
  }
  
  export interface Literal extends Expression {
    value: string|number;
    rawValue: string|number;
    raw: string;
  }
  
  export interface TemplateLiteral extends Expression {
    expressions: Expression[];
    quasis: TemplateElement[];
  }
  
  export interface TemplateElement extends Node {
    value: { raw: string; cooked: string };
    tail: boolean;
  }
  
  export interface Identifier extends Expression {
    name: string;
  }
}
