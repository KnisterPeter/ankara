/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as th from './type-helper';
import {parse, parseFragment} from './parser';

export abstract class Node<T extends babylon.Node> {

  private _instrumented: boolean;

  private _raw: T;

  private _parent: Node<any>;

  private _start: number;

  private _end: number;

  constructor(raw: T, parent?: Node<any>, instrumented = false) {
    this._raw = raw;
    this._parent = parent;
    this._instrumented = instrumented;
  }

  get raw() {
    return this._raw;
  }

  get parent() {
    return this._parent;
  }

  set parent(parent: Node<any>) {
    this._parent = parent;
  }

  get loc() {
    return this.raw.loc;
  }

  get start() {
    if (typeof this._start == 'undefined') {
      this._start = this.raw.start;
    }
    return this._start;
  }

  get end() {
    if (typeof this._end == 'undefined') {
      this._end = this.raw.end;
    }
    return this._end;
  }

  get instrumented() {
    return this._instrumented;
  }

  public instrument(path: string): void {
    throw new Error('Unsupported');
  }

  replaceWith(nodes: Node<any>|Node<any>[]) {
    this.parent.replaceChild(this, nodes);
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

  insertBefore(nodes: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(nodes)) {
      children = [].concat(nodes, this);
    } else {
      children = [nodes, this];
    }
    this.parent.replaceChild(this, children);
  }

  insertAfter(nodes: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(nodes)) {
      children = [].concat(this, nodes);
    } else {
      children = [this, nodes];
    }
    this.parent.replaceChild(this, children);
  }

  public visit(fn: (node: Node<any>) => void): void {
    throw new Error('Unsupported');
  }

  public toJavaScript(): string {
    throw new Error('Unsupported');
  }

}

export class RestElement extends Node<babylon.RestElement> {

  private _argument: Identifier;

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = <Identifier>th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `...${this.argument.toJavaScript()}`;
  }

}

export class File extends Node<babylon.File> {

  private _program: Program;

  get program() {
    if (typeof this._program == 'undefined') {
      this._program = <Program>th.convert(this.raw.program, this);
    }
    return this._program;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.program.visit(fn);
  }

  public toJavaScript(): string {
    return this.program.toJavaScript();
  }

}

export class Program extends Node<babylon.Program> {

  private _body: Statement<any>[];

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = this.raw.body.map(statement => th.convert(statement, this));
    }
    return this._body;
  }

  set body(body: Statement<any>[]) {
    this._body = body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    if (Array.isArray(dest)) {
      (<Node<any>[]>dest).forEach(node => node.parent = this);
    } else {
      (<Node<any>>dest).parent = this;
    }
    let idx = this._body.indexOf(source);
    this._body = [].concat(
      this._body.slice(0, idx),
      dest,
      this._body.slice(idx + 1, this._body.length)
    );
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.body.forEach(statement => statement.visit(fn));
  }

  public toJavaScript(): string {
    return this.body.map(statement => statement.toJavaScript()).join('\n');
  }

}

export abstract class Statement<T extends babylon.Node> extends Node<T> {
}

export class ThrowStatement extends Statement<babylon.ThrowStatement> {

  private _argument: Expression<any>;

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = <Identifier>th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `throw ${this.argument.toJavaScript()};`;
  }

}

export class BreakStatement extends Statement<babylon.BreakStatement> {

  private _label: Identifier;

  get label() {
    if (typeof this._label == 'undefined' && this.raw.label) {
      this._label = <Identifier>th.convert(this.raw.label, this);
    }
    return this._label;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.label) {
      this.label.visit(fn);
    }
  }

  public toJavaScript(): string {
    return `break ${this.label ? this.label.toJavaScript() : ''};`;
  }

}

export class SwitchStatement extends Statement<babylon.SwitchStatement> {

  private _discriminant: Expression<any>;

  private _cases: SwitchCase[];

  get discriminant() {
    if (typeof this._discriminant == 'undefined') {
      this._discriminant = th.convert(this.raw.discriminant, this);
    }
    return this._discriminant;
  }

  get cases() {
    if (typeof this._cases == 'undefined') {
      this._cases = this.raw.cases.map(_case => <SwitchCase>th.convert(_case, this));
    }
    return this._cases;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.discriminant.visit(fn);
    this.cases.forEach(_case => _case.visit(fn));
  }

  public toJavaScript(): string {
    return `switch (${this.discriminant.toJavaScript()}) { ${this.cases.map(_case => _case.toJavaScript()).join('')} }`;
  }

}

export class SwitchCase extends Node<babylon.SwitchCase> {

  private _test: Node<any>;

  private _consequent: Statement<any>[];

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get consequent() {
    if (typeof this._consequent == 'undefined') {
      this._consequent = this.raw.consequent.map(_case => th.convert(_case, this));
    }
    return this._consequent;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.test) {
      this.test.visit(fn);
    }
    this.consequent.forEach(consequent => consequent.visit(fn));
  }

  public toJavaScript(): string {
    let source;
    if (this.test === null) {
      source = `default:\n`;
    } else {
      source = `case ${this.test.toJavaScript()}:\n`;
    }
    return `${source}${this.consequent.map(consequent => consequent.toJavaScript()).join('\n')}`;
  }

}

export class IfStatement extends Statement<babylon.IfStatement> {

  private _test: Expression<any>;

  private _consequent: Statement<any>;

  private _alternate: Statement<any>;

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get consequent() {
    if (typeof this._consequent == 'undefined') {
      this._consequent = th.convert(this.raw.consequent, this);
    }
    return this._consequent;
  }

  get alternate() {
    if (typeof this._alternate == 'undefined' && this.raw.alternate) {
      this._alternate = th.convert(this.raw.alternate, this);
    }
    return this._alternate;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.test.visit(fn);
    this.consequent.visit(fn);
    if (this.alternate) {
      this.alternate.visit(fn);
    }
  }

  public toJavaScript(): string {
    let source = `if (${this.test.toJavaScript()}) ${this.consequent.toJavaScript()}`;
    if (this.alternate) {
      source = `${source} else ${this.alternate.toJavaScript()}`;
    }
    return source;
  }

}

export class ImportDeclaration extends Statement<babylon.ImportDeclaration> {

  private _importKind: string;

  private _specifiers: ImportNamespaceSpecifier[];

  private _source: Node<any>;

  get importKind() {
    if (typeof this._importKind == 'undefined') {
      this._importKind = this.raw.importKind;
    }
    return this._importKind;
  }

  get specifiers() {
    if (typeof this._specifiers == 'undefined') {
      this._specifiers = this.raw.specifiers.map(specifier => <ImportNamespaceSpecifier>th.convert(specifier, this));
    }
    return this._specifiers;
  }

  get source() {
    if (typeof this._source == 'undefined') {
      this._source = th.convert(this.raw.source, this);
    }
    return this._source;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.specifiers.forEach(specifier => specifier.visit(fn));
    this.source.visit(fn);
  }

  public toJavaScript(): string {
    let imports = [];
    let namedImports = this.specifiers
      .filter(specifier => specifier instanceof ImportSpecifier)
      .map(specifier => specifier.toJavaScript())
      .join(', ');
    if (namedImports) {
      imports.push(`{${namedImports}}`);
    }
    let otherImports = this.specifiers
      .filter(specifier => !(specifier instanceof ImportSpecifier))
      .map(specifier => specifier.toJavaScript())
      .join(', ');
    if (otherImports) {
      imports.push(otherImports);
    }
    return `import ${imports.join(', ')} from ${this.source.toJavaScript()};\n`;
  }

}

export class ImportDefaultSpecifier extends Node<babylon.ImportDefaultSpecifier> {

  private _local: Identifier;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.local.toJavaScript()}`;
  }

}

export class ImportNamespaceSpecifier extends Node<babylon.ImportNamespaceSpecifier> {

  private _local: Node<any>;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    return `* as ${this.local.toJavaScript()}`;
  }

}

export class ImportSpecifier extends Node<babylon.ImportSpecifier> {

  private _imported: Identifier;

  private _local: Identifier;

  get imported() {
    if (typeof this._imported == 'undefined') {
      this._imported = <Identifier>th.convert(this.raw.imported, this);
    }
    return this._imported;
  }

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.imported.visit(fn);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    if (this.imported.name == this.local.name) {
      return `${this.imported.toJavaScript()}`;
    }
    return `${this.imported.toJavaScript()} as ${this.local.toJavaScript()}`;
  }

}

export class ExportDefaultDeclaration extends Statement<babylon.ExportDefaultDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (typeof this._declaration == 'undefined') {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.declaration.visit(fn);
  }

  public toJavaScript(): string {
    return `export default ${this.declaration.toJavaScript()}\n`;
  }

}

export class ExportNamedDeclaration extends Statement<babylon.ExportNamedDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (typeof this._declaration == 'undefined') {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.declaration.visit(fn);
  }

  public toJavaScript(): string {
    return `export ${this.declaration.toJavaScript()}\n`;
  }

}

export class BlockStatement extends Statement<babylon.BlockStatement> {

  private _body: Statement<any>[];

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = this.raw.body.map(statement => th.convert(statement, this));
   }
    return this._body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    if (Array.isArray(dest)) {
      (<Node<any>[]>dest).forEach(node => node.parent = this);
    } else {
      (<Node<any>>dest).parent = this;
    }
    let idx = this._body.indexOf(source);
    this._body = [].concat(
      this._body.slice(0, idx),
      dest,
      this._body.slice(idx + 1, this._body.length)
    );
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.body.forEach(statement => statement.visit(fn));
  }

  public toJavaScript(): string {
    return `{\n${this.body.map(statement => statement.toJavaScript()).join('\n')}}\n`;
  }

}

export class ExpressionStatement extends Statement<babylon.ExpressionStatement> {

  private _expression: Expression<any>;

  constructor(raw: babylon.ExpressionStatement, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get expression() {
    if (typeof this._expression == 'undefined') {
      this._expression = th.convert(this.raw.expression, this);
    }
    return this._expression;
  }

  public instrument(path: string): void {
    // Guard of own code...
    const expression = this.expression;
    if (expression instanceof CallExpression) {
      let expression2: Node<any> = expression.callee;
      while (expression2 instanceof MemberExpression) {
        expression2 = (<MemberExpression>expression2).object;
      }
      if (expression2 instanceof Identifier) {
        if (expression2.name === '__$c') {
          return;
        }
      }
    }

    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    this.replaceWith(
      th.expressionStatement(
        th.sequenceExpression([
          fragment.expression,
          this.expression
        ])
      )
    );
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.expression.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.expression.toJavaScript()};\n`;
  }

}

export class ReturnStatement extends Statement<babylon.ReturnStatement> {

  private _argument: Expression<any>;

  constructor(raw: babylon.ReturnStatement, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public instrument(path: string): void {
    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    this.argument.replaceWith(
      th.sequenceExpression([
        fragment.expression,
        this.argument
      ])
    );
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    if (Array.isArray(dest)) {
      throw new Error('Not supported');
    } else {
      (<Node<any>>dest).parent = this;
      this._argument = <Node<any>>dest;
    }
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument && this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `return ${this.argument ? this.argument.toJavaScript() : ''};\n`;
  }

}

export class VariableDeclaration extends Statement<babylon.VariableDeclaration> {

  private _kind: string;

  private _declarations: VariableDeclarator[];

  constructor(raw: babylon.VariableDeclaration, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get kind() {
    if (typeof this._kind == 'undefined') {
      this._kind = this.raw.kind;
    }
    return this._kind;
  }

  get declarations() {
    if (typeof this._declarations == 'undefined') {
      this._declarations = this.raw.declarations.map(declaration => <VariableDeclarator>th.convert(declaration, this));
    }
    return this._declarations;
  }

  public instrument(path: string): void {
    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    if (this.parent instanceof ForOfStatement
        || this.parent instanceof ForStatement
        || this.parent instanceof ExportNamedDeclaration) {
      this.parent.insertBefore(fragment);
    } else {
      this.insertBefore(fragment);
    }
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.declarations.forEach(declaration => declaration.visit(fn));
  }

  public toJavaScript(): string {
    const isStatement = !(this.parent instanceof ForOfStatement || this.parent instanceof ForStatement);
    return `${this.kind} ${this.declarations.map(declaration => declaration.toJavaScript()).join(', ')}${isStatement ? ';': ''}`;
  }

}

export class VariableDeclarator extends Node<babylon.VariableDeclarator> {

  private _id: Identifier;

  private _init: Expression<any>;

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get init() {
    if (typeof this._init == 'undefined') {
      this._init = th.convert(this.raw.init, this);
    }
    return this._init;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id.visit(fn);
    if (this.init != null) {
      this.init.visit(fn);
    }
  }

  public toJavaScript(): string {
    return `${this.id.toJavaScript()}${this.init != null ? ` = ${this.init.toJavaScript()}` : ''}`;
  }

}

export class ForStatement extends Statement<babylon.ForStatement> {

  private _init: Node<any>;

  private _test: Expression<any>;

  private _update: Expression<any>;

  private _body: Statement<any>;

  get init() {
    if (typeof this._init == 'undefined') {
      this._init = th.convert(this.raw.init, this);
    }
    return this._init;
  }

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get update() {
    if (typeof this._update == 'undefined') {
      this._update = th.convert(this.raw.update, this);
    }
    return this._update;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.init.visit(fn);
    this.test.visit(fn);
    this.update.visit(fn);
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `for (${this.init.toJavaScript()};${this.test.toJavaScript()};${this.update.toJavaScript()}) ${this.body.toJavaScript()}\n`;
  }

}

export class ForOfStatement extends Statement<babylon.ForOfStatement> {

  private _left: Expression<any>;

  private _right: Expression<any>;

  private _body: Statement<any>;

  get left() {
    if (typeof this._left == 'undefined') {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (typeof this._right == 'undefined') {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `for (${this.left.toJavaScript()} of ${this.right.toJavaScript()}) ${this.body.toJavaScript()}\n`;
  }

}

export abstract class Expression<T extends babylon.Node> extends Node<T> {
}

export class UpdateExpression extends Node<babylon.UpdateExpression> {

  private _operator: string;

  private _prefix: boolean;

  private _argument: Identifier;

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get prefix() {
    if (typeof this._prefix == 'undefined') {
      this._prefix = this.raw.prefix;
    }
    return this._prefix;
  }

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = <Identifier>th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.prefix ? this.operator : ''}${this.argument.toJavaScript()}${!this.prefix ? this.operator : ''}`;
  }

}

export class ConditionalExpression extends Node<babylon.ConditionalExpression> {

  private _test: Expression<any>;

  private _consequent: Expression<any>;

  private _alternate: Expression<any>;

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get consequent() {
    if (typeof this._consequent == 'undefined') {
      this._consequent = th.convert(this.raw.consequent, this);
    }
    return this._consequent;
  }

  get alternate() {
    if (typeof this._alternate == 'undefined') {
      this._alternate = th.convert(this.raw.alternate, this);
    }
    return this._alternate;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.test.visit(fn);
    this.consequent.visit(fn);
    this.alternate.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.test.toJavaScript()} ? ${this.consequent.toJavaScript()} : ${this.alternate.toJavaScript()}`;
  }

}

export class ThisExpression extends Node<babylon.ThisExpression> {

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return 'this';
  }

}

export class NewExpression extends Node<babylon.NewExpression> {

  private _callee: Node<any>;

  private _arguments: Identifier[];

  get callee() {
    if (typeof this._callee == 'undefined') {
      this._callee = th.convert(this.raw.callee, this);
    }
    return this._callee;
  }

  get arguments() {
    if (typeof this._arguments == 'undefined') {
      this._arguments = this.raw.arguments.map(argument => <Identifier>th.convert(argument, this));
    }
    return this._arguments;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.callee.visit(fn);
    this.arguments.forEach(argument => argument.visit(fn));
  }

  public toJavaScript(): string {
    return `new ${this.callee.toJavaScript()}(${this.arguments.map(argument => argument.toJavaScript()).join(', ')})`;
  }

}

export class ObjectExpression extends Expression<babylon.ObjectExpression> {

  private _properties: Property[];

  get properties() {
    if (typeof this._properties == 'undefined') {
      this._properties = this.raw.properties.map(property => <Property>th.convert(property, this));
    }
    return this._properties;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.properties.forEach(property => property.visit(fn));
  }

  public toJavaScript(): string {
    return `{${this.properties.map(property => property.toJavaScript()).join(', ')}}`;
  }

}

export class Property extends Expression<babylon.Property> {

  private _method: boolean;

  private _shorthand: boolean;

  private _computed: boolean;

  private _key: Identifier;

  private _value: Node<any>;

  get method() {
    if (typeof this._method == 'undefined') {
      this._method = this.raw.method;
    }
    return this._method;
  }

  get shorthand() {
    if (typeof this._shorthand == 'undefined') {
      this._shorthand = this.raw.shorthand;
    }
    return this._shorthand;
  }

  get computed() {
    if (typeof this._computed == 'undefined') {
      this._computed = this.raw.computed;
    }
    return this._computed;
  }

  get key() {
    if (typeof this._key == 'undefined') {
      this._key = <Identifier>th.convert(this.raw.key, this);
    }
    return this._key;
  }

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = th.convert(this.raw.value, this);
    }
    return this._value;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.key.visit(fn);
    this.value.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.key.toJavaScript()}: ${this.value.toJavaScript()}`;
  }

}

export class UnaryExpression extends Expression<babylon.UnaryExpression> {

  private _operator: string;

  private _prefix: boolean;

  private _argument: Node<any>;

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get prefix() {
    if (typeof this._prefix == 'undefined') {
      this._prefix = this.raw.prefix;
    }
    return this._prefix;
  }

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.operator} ${this.argument.toJavaScript()}`;
  }

}

export class LogicalExpression extends Expression<babylon.LogicalExpression> {

  private _left: Expression<any>;

  private _operator: string;

  private _right: Expression<any>;

  get left() {
    if (typeof this._left == 'undefined') {
      this._left = <Expression<any>>th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get right() {
    if (typeof this._right == 'undefined') {
      this._right = <Expression<any>>th.convert(this.raw.right, this);
    }
    return this._right;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.left.toJavaScript()} ${this.operator} ${this.right.toJavaScript()}`;
  }

}

export class AssignmentExpression extends Expression<babylon.AssignmentExpression> {

  private _operator: string;

  private _left: Expression<any>;

  private _right: Expression<any>;

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get left() {
    if (typeof this._left == 'undefined') {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (typeof this._right == 'undefined') {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.left.toJavaScript()} ${this.operator} ${this.right.toJavaScript()}`;
  }

}

export class ArrayExpression extends Expression<babylon.ArrayExpression> {

  private _elements: Expression<any>[];

  get elements() {
    if (typeof this._elements == 'undefined') {
      this._elements = this.raw.elements.map(expression => th.convert(expression, this));
    }
    return this._elements;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.elements.forEach(element => element.visit(fn));
  }

  public toJavaScript(): string {
    return `[${this.elements.map(element => element.toJavaScript()).join(', ')}]`;
  }

}

export class SequenceExpression extends Expression<babylon.SequenceExpression> {

  private _expressions: Expression<any>[];

  get expressions() {
    if (typeof this._expressions == 'undefined') {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression, this));
    }
    return this._expressions;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(dest)) {
      children = <Node<any>[]>dest;
    } else {
      children = [dest];
    }
    children.forEach(node => node.parent = this);
    this._expressions = children;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.expressions.forEach(expression => expression.visit(fn));
  }

  public toJavaScript(): string {
    return `(${this.expressions.map(expression => expression.toJavaScript()).join(', ')})`;
  }

}

export class BinaryExpression extends Expression<babylon.BinaryExpression> {

  private _operator: string;

  private _left: Expression<any>;

  private _right: Expression<any>;

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get left() {
    if (typeof this._left == 'undefined') {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (typeof this._right == 'undefined') {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.left.toJavaScript()} ${this.operator} ${this.right.toJavaScript()}`;
  }

}

export class FunctionExpression extends Expression<babylon.FunctionExpression> {

  private _generator: boolean;

  private _id: Identifier;
  
  private _params: Identifier[];
  
  private _body: Statement<any>;

  get generator() {
    if (typeof this._generator == 'undefined') {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get params() {
    if (typeof this._params == 'undefined') {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param, this));
    }
    return this._params;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id && this.id.visit(fn);
    this.params.forEach(param => param.visit(fn));
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `function${this.generator ? '*' : ''} ${this.id ? this.id.toJavaScript() : ''}(${this.params.map(param => param.toJavaScript()).join(', ')}) ${this.body.toJavaScript()}`;
  }

}

export class ArrowFunctionExpression extends Expression<babylon.ArrowFunctionExpression> {

  _id: Identifier;

  _generator: boolean;

  _expression: boolean;

  _params: Identifier[];

  _body: Statement<babylon.Statement>;

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get generator() {
    if (typeof this._generator == 'undefined') {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get expression() {
    if (typeof this._expression == 'undefined') {
      this._expression = this.raw.expression;
    }
    return this._expression;
  }

  get params() {
    if (typeof this._params == 'undefined') {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param, this));
    }
    return this._params;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id && this.id.visit(fn);
    this.params.forEach(param => param.visit(fn));
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.generator ? '*' : ''}(${this.params.map(param => param.toJavaScript()).join(', ')}) => ${this.body.toJavaScript()}`;
  }

}


export class FunctionDeclaration extends Expression<babylon.FunctionDeclaration> {

  private _generator: boolean;

  private _id: Identifier;
  
  private _params: Identifier[];
  
  private _body: Statement<any>;

  get generator() {
    if (typeof this._generator == 'undefined') {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get params() {
    if (typeof this._params == 'undefined') {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param, this));
    }
    return this._params;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id && this.id.visit(fn);
    this.params.forEach(param => param.visit(fn));
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `function${this.generator ? '*' : ''} ${this.id ? this.id.toJavaScript() : ''}(${this.params.map(param => param.toJavaScript()).join(', ')}) ${this.body.toJavaScript()}`;
  }

}

export class CallExpression extends Expression<babylon.CallExpression> {

  private _callee: Expression<any>;

  private _arguments: Expression<any>[];

  get callee() {
    if (typeof this._callee == 'undefined') {
      this._callee = th.convert(this.raw.callee, this);
    }
    return this._callee;
  }

  get arguments() {
    if (typeof this._arguments == 'undefined') {
      this._arguments = this.raw.arguments.map(argument => th.convert(argument, this));
    }
    return this._arguments;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.callee.visit(fn);
    this.arguments.forEach(arg => arg.visit(fn));
  }

  public toJavaScript(): string {
    return `${this.callee.toJavaScript()}(${this.arguments.map(arg => arg.toJavaScript()).join(', ')})`;
  }

}

export class MemberExpression extends Expression<babylon.MemberExpression> {

  private _object: Node<any>;

  private _property: Node<any>;

  get object() {
    if (typeof this._object == 'undefined') {
      this._object = th.convert(this.raw.object, this);
    }
    return this._object;
  }

  get property() {
    if (typeof this._property == 'undefined') {
      this._property = th.convert(this.raw.property, this);
    }
    return this._property;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.object.visit(fn);
    this.property.visit(fn);
  }

  public toJavaScript(): string {
    const property = this.property;
    if (!(property instanceof Identifier)) {
      return `${this.object.toJavaScript()}[${property.toJavaScript()}]`;
    }
    return `${this.object.toJavaScript()}.${property.toJavaScript()}`;
  }

}

export class Literal extends Expression<babylon.Literal> {

  private _value: string|number;

  private _rawValue: string|number;

  // private _raw: string;

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get rawValue() {
    if (typeof this._rawValue == 'undefined') {
      this._rawValue = this.raw.rawValue;
    }
    return this._rawValue;
  }

  // get raw() {
  //   if (typeof this._raw == 'undefined') {
  //     this._raw = this.raw.raw;
  //   }
  //   return this._raw;
  // }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    let str = this.value;
    if (typeof str === 'string') {
      str = "'" + (<string>str).replace(/'/g, "\\'") + "'";
    } else if (this.value === null) {
      str = 'null';
    }
    return <string>str;
  }

}

export class TemplateLiteral extends Expression<babylon.TemplateLiteral> {

  private _expressions: Expression<any>[];

  private _quasis: TemplateElement[];

  get expressions() {
    if (typeof this._expressions == 'undefined') {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression, this));
    }
    return this._expressions;
  }

  get quasis() {
    if (typeof this._quasis == 'undefined') {
      this._quasis = this.raw.quasis.map(quasi => <TemplateElement>th.convert(quasi, this));
    }
    return this._quasis;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    [].concat(this.quasis, this.expressions)
      .sort((a, b) => a.start - b.start)
      .forEach(node => node.visit(fn));
  }

  public toJavaScript(): string {
    return '`' + ([].concat(this.quasis, this.expressions))
      .sort((a, b) => a.start - b.start)
      .map(node => {
        if (!(node instanceof TemplateElement)) {
          return '${' + node.toJavaScript() + '}';
        }
        return node.toJavaScript();
      })
      .join('') + '`';
  }

}

export class TemplateElement extends Node<babylon.TemplateElement> {

  private _value: { raw: string; cooked: string };

  private _tail: boolean;

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get tail() {
    if (typeof this._tail == 'undefined') {
      this._tail = this.raw.tail;
    }
    return this._tail;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return this.value.raw;
  }

}

export class Identifier extends Expression<babylon.Identifier> {

  private _name: string;

  get name() {
    if (typeof this._name == 'undefined') {
      this._name = this.raw.name;
    }
    return this._name;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return this.name;
  }

}
