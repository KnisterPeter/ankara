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

}

export class RestElement extends Node<babylon.RestElement> {

  private _argument: Identifier;

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = <Identifier>th.convert(this.raw.argument, this);
    }
    return this._argument;
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

}

export class BreakStatement extends Statement<babylon.BreakStatement> {

  private _label: Identifier;

  get label() {
    if (typeof this._label == 'undefined' && this.raw.label) {
      this._label = <Identifier>th.convert(this.raw.label, this);
    }
    return this._label;
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

}

export class ImportDefaultSpecifier extends Node<babylon.ImportDefaultSpecifier> {

  private _local: Identifier;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
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

}

export class ExportDefaultDeclaration extends Statement<babylon.ExportDefaultDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (typeof this._declaration == 'undefined') {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
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
    if (this.parent instanceof ForOfStatement || this.parent instanceof ForStatement) {
      this.parent.insertBefore(fragment);
    } else {
      this.insertBefore(fragment);
    }
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

}

export class ThisExpression extends Node<babylon.ThisExpression> {
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

}

export class ObjectExpression extends Expression<babylon.ObjectExpression> {

  private _properties: Property[];

  get properties() {
    if (typeof this._properties == 'undefined') {
      this._properties = this.raw.properties.map(property => <Property>th.convert(property, this));
    }
    return this._properties;
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

}

export class ArrayExpression extends Expression<babylon.ArrayExpression> {

  private _elements: Expression<any>[];

  get elements() {
    if (typeof this._elements == 'undefined') {
      this._elements = this.raw.elements.map(expression => th.convert(expression, this));
    }
    return this._elements;
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

}

export class Identifier extends Expression<babylon.Identifier> {

  private _name: string;

  get name() {
    if (typeof this._name == 'undefined') {
      this._name = this.raw.name;
    }
    return this._name;
  }

}
