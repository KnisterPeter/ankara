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

  export interface RestElement extends Node {
    argument: Identifier;
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

  export interface ThrowStatement extends Statement {
    argument: Expression;
  }

  export interface BreakStatement extends Statement {
    label: Identifier;
  }

  export interface SwitchStatement extends Statement {
    discriminant: Expression;
    cases: SwitchCase[];
  }

  export interface SwitchCase extends Node {
    test: Node;
    consequent: Statement[];
  }

  export interface IfStatement extends Statement {
    test: Expression;
    consequent: Statement;
    alternate: Statement;
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

  export interface ForStatement extends Statement {
    init: Node;
    test: Expression;
    update: Expression;
    body: Statement;
  }

  export interface ForOfStatement extends Statement {
    left: Node;
    right: Node;
    body: Statement;
  }

  export interface Expression extends Node {
  }

  export interface UpdateExpression extends Expression {
    operator: string;
    prefix: boolean;
    argument: Identifier;
  }

  export interface ConditionalExpression extends Expression {
    test: Expression;
    consequent: Expression;
    alternate: Expression;
  }

  export interface ThisExpression extends Expression {
  }

  export interface NewExpression extends Expression {
    callee: Node;
    arguments: Identifier[];
  }

  export interface ObjectExpression extends Expression {
    properties: Property[];
  }

  export interface Property extends Expression {
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    key: Identifier;
    value: Node;
  }

  export interface UnaryExpression extends Expression {
    operator: string;
    prefix: boolean;
    argument: Node;
  }

  export interface LogicalExpression extends Expression {
    left: Expression;
    operator: string;
    right: Expression;
    parenthesizedExpression: boolean;
  }

  export interface AssignmentExpression extends Expression {
    operator: string;
    left: Node;
    right: Expression;
    parenthesizedExpression: boolean;
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
    id: Identifier;
    generator: boolean;
    expression: boolean;
    async: boolean;
    params: Identifier[];
    body: BlockStatement;
    parenthesizedExpression: boolean;
  }

  export interface ArrowFunctionExpression extends Expression {
    id: Identifier;
    generator: boolean;
    expression: boolean;
    params: Identifier[];
    body: Statement;
  }

  export interface FunctionDeclaration extends Expression {
    id: Identifier;
    generator: boolean;
    expression: boolean;
    async: boolean;
    params: Identifier[];
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

  export interface ClassDeclaration extends Node {
    id: Identifier;
    superClass: Node;
    body: ClassBody;
  }

  export interface ClassBody extends Node {
    body: Node[];
  }

  export interface Super extends Node {
  }

  export interface MethodDefinition extends Node {
    key: Identifier;
    static: boolean;
    kind: string;
    value: Expression;
  }

  export interface ClassProperty extends Node {
    computed: boolean;
    key: Identifier;
    static: boolean;
    value: Node;
  }

  export interface AwaitExpression extends Expression {
    all: boolean;
    argument: Expression;
  }

  export interface ForInStatement extends Statement {
    left: Expression;
    right: Expression;
    body: Statement;
  }

  export interface TryStatement extends Statement {
    block: BlockStatement;
    handler: CatchClause;
  }

  export interface CatchClause extends Node {
    param: Identifier;
    body: BlockStatement;
  }

  export interface ContinueStatement extends Statement {
    label: Identifier;
  }

  export interface WhileStatement extends Statement {
    test: Expression;
    body: Statement;
  }

  export interface DoWhileStatement extends Statement {
    test: Expression;
    body: Statement;
  }

  export interface SpreadElement extends Node {
    argument: Identifier;
  }

  export interface ArrayPattern extends Node {
    elements: Identifier[];
  }

  export interface SpreadProperty extends Node {
    argument: Identifier;
  }

}
