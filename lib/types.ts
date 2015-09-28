/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as th from './type-helper';

export abstract class Node<T extends babylon.Node> {

  private _raw: T;

  private _parent: Node<any>;

  private _start: number;

  private _end: number;

  constructor(raw: T, parent?: Node<any>) {
    this._raw = raw;
    this._parent = parent;
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

  get start() {
    if (!this._start) {
      this._start = this.raw.start;
    }
    return this._start;
  }

  get end() {
    if (!this._end) {
      this._end = this.raw.end;
    }
    return this._end;
  }

  replaceWith(nodes: Node<any>|Node<any>[]) {
    this.parent.replaceChild(this, nodes);
  }

  protected abstract replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]);

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

export class File extends Node<babylon.File> {

  private _program: Program;

  get program() {
    if (!this._program) {
      this._program = new Program(this.raw.program, this);
    }
    return this._program;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class Program extends Node<babylon.Program> {

  private _body: Statement<any>[];

  get body() {
    if (!this._body) {
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

export class ImportDeclaration extends Statement<babylon.ImportDeclaration> {

  private _importKind: string;

  private _specifiers: ImportNamespaceSpecifier[];

  private _source: Node<any>;

  get importKind() {
    if (!this._importKind) {
      this._importKind = this.raw.importKind;
    }
    return this._importKind;
  }

  get specifiers() {
    if (!this._specifiers) {
      this._specifiers = this.raw.specifiers.map(specifier => <ImportNamespaceSpecifier>th.convert(specifier, this));
    }
    return this._specifiers;
  }

  get source() {
    if (!this._source) {
      this._source = th.convert(this.raw.source, this);
    }
    return this._source;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ImportNamespaceSpecifier extends Node<babylon.ImportNamespaceSpecifier> {

  private _local: Node<any>;

  get local() {
    if (!this._local) {
      this._local = th.convert(this.raw.local, this);
    }
    return this._local;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ImportSpecifier extends Node<babylon.ImportSpecifier> {

  private _imported: Identifier;

  private _local: Identifier;

  get imported() {
    if (!this._imported) {
      this._imported = <Identifier>th.convert(this.raw.imported, this);
    }
    return this._imported;
  }

  get local() {
    if (!this._local) {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ExportDefaultDeclaration extends Statement<babylon.ExportDefaultDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (!this._declaration) {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ExportNamedDeclaration extends Statement<babylon.ExportNamedDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (!this._declaration) {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class BlockStatement extends Statement<babylon.BlockStatement> {

  private _body: Statement<any>[];

  get body() {
    if (!this._body) {
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

  get expression() {
    if (!this._expression) {
      this._expression = th.convert(this.raw.expression, this);
    }
    return this._expression;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ReturnStatement extends Statement<babylon.ReturnStatement> {

  private _argument: Expression<any>;

  get argument() {
    if (!this._argument) {
      this._argument = th.convert(this.raw.argument, this);
    }
    return this._argument;
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

  get kind() {
    if (!this._kind) {
      this._kind = this.raw.kind;
    }
    return this._kind;
  }

  get declarations() {
    if (!this._declarations) {
      this._declarations = this.raw.declarations.map(declaration => <VariableDeclarator>th.convert(declaration, this));
    }
    return this._declarations;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class VariableDeclarator extends Node<babylon.VariableDeclarator> {

  private _id: Identifier;

  private _init: Expression<any>;

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get init() {
    if (!this._init) {
      this._init = th.convert(this.raw.init, this);
    }
    return this._init;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ForOfStatement extends Statement<babylon.ForOfStatement> {

  private _left: Expression<any>;

  private _right: Expression<any>;

  private _body: Statement<any>;

  get left() {
    if (!this._left) {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export abstract class Expression<T extends babylon.Node> extends Node<T> {
}

export class AssignmentExpression extends Expression<babylon.AssignmentExpression> {

  private _operator: string;

  private _left: Expression<any>;

  private _right: Expression<any>;

  get operator() {
    if (!this._operator) {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get left() {
    if (!this._left) {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class ArrayExpression extends Expression<babylon.ArrayExpression> {

  private _elements: Expression<any>[];

  get elements() {
    if (!this._elements) {
      this._elements = this.raw.elements.map(expression => th.convert(expression, this));
    }
    return this._elements;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class SequenceExpression extends Expression<babylon.SequenceExpression> {

  private _expressions: Expression<any>[];

  get expressions() {
    if (!this._expressions) {
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
    if (!this._operator) {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get left() {
    if (!this._left) {
      this._left = th.convert(this.raw.left, this);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right, this);
    }
    return this._right;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class FunctionExpression extends Expression<babylon.FunctionExpression> {

  private _generator: boolean;

  private _id: Identifier;
  
  private _params: Identifier[];
  
  private _body: Statement<any>;

  get generator() {
    if (!this._generator) {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get params() {
    if (!this._params) {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param, this));
    }
    return this._params;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class FunctionDeclaration extends Expression<babylon.FunctionDeclaration> {

  private _generator: boolean;

  private _id: Identifier;
  
  private _params: Identifier[];
  
  private _body: Statement<any>;

  get generator() {
    if (!this._generator) {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get params() {
    if (!this._params) {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param, this));
    }
    return this._params;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class CallExpression extends Expression<babylon.CallExpression> {

  private _callee: Expression<any>;

  private _arguments: Expression<any>[];

  get callee() {
    if (!this._callee) {
      this._callee = th.convert(this.raw.callee, this);
    }
    return this._callee;
  }

  get arguments() {
    if (!this._arguments) {
      this._arguments = this.raw.arguments.map(argument => th.convert(argument, this));
    }
    return this._arguments;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class MemberExpression extends Expression<babylon.MemberExpression> {

  private _object: Node<any>;

  private _property: Node<any>;

  get object() {
    if (!this._object) {
      this._object = th.convert(this.raw.object, this);
    }
    return this._object;
  }

  get property() {
    if (!this._property) {
      this._property = th.convert(this.raw.property, this);
    }
    return this._property;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class Literal extends Expression<babylon.Literal> {

  private _value: string|number;

  private _rawValue: string|number;

  // private _raw: string;

  get value() {
    if (!this._value) {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get rawValue() {
    if (!this._rawValue) {
      this._rawValue = this.raw.rawValue;
    }
    return this._rawValue;
  }

  // get raw() {
  //   if (!this._raw) {
  //     this._raw = this.raw.raw;
  //   }
  //   return this._raw;
  // }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class TemplateLiteral extends Expression<babylon.TemplateLiteral> {

  private _expressions: Expression<any>[];

  private _quasis: TemplateElement[];

  get expressions() {
    if (!this._expressions) {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression, this));
    }
    return this._expressions;
  }

  get quasis() {
    if (!this._quasis) {
      this._quasis = this.raw.quasis.map(quasi => <TemplateElement>th.convert(quasi, this));
    }
    return this._quasis;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class TemplateElement extends Node<babylon.TemplateElement> {

  private _value: { raw: string; cooked: string };

  private _tail: boolean;

  get value() {
    if (!this._value) {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get tail() {
    if (!this._tail) {
      this._tail = this.raw.tail;
    }
    return this._tail;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}

export class Identifier extends Expression<babylon.Identifier> {

  private _name: string;

  get name() {
    if (!this._name) {
      this._name = this.raw.name;
    }
    return this._name;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

}
