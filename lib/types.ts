/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';
import * as th from './type-helper';

export class Node<T> {

  private _raw: T;

  constructor(raw: T) {
    this._raw = raw;
  }

  get raw() {
    return this._raw;
  }

}

export class File extends Node<babylon.File> {

  private _program: Program;

  get program() {
    if (!this._program) {
      this._program = new Program(this.raw.program);
    }
    return this._program;
  }

}

export class Program extends Node<babylon.Program> {

  private _body: Statement<any>[];

  get body() {
    if (!this._body) {
      this._body = this.raw.body.map(statement => th.convert(statement));
    }
    return this._body;
  }

}

export class Statement<T> extends Node<T> {
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
      this._specifiers = this.raw.specifiers.map(specifier => <ImportNamespaceSpecifier>th.convert(specifier));
    }
    return this._specifiers;
  }

  get source() {
    if (!this._source) {
      this._source = th.convert(this.raw.source);
    }
    return this._source;
  }

}

export class ImportNamespaceSpecifier extends Node<babylon.ImportNamespaceSpecifier> {

  private _local: Node<any>;

  get local() {
    if (!this._local) {
      this._local = th.convert(this.raw.local);
    }
    return this._local;
  }

}

export class ExportDefaultDeclaration extends Statement<babylon.ExportDefaultDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (!this._declaration) {
      this._declaration = th.convert(this.raw.declaration);
    }
    return this._declaration;
  }

}

export class ExportNamedDeclaration extends Statement<babylon.ExportNamedDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (!this._declaration) {
      this._declaration = th.convert(this.raw.declaration);
    }
    return this._declaration;
  }

}

export class BlockStatement extends Statement<babylon.BlockStatement> {

  private _body: Statement<any>[];

  get body() {
    if (!this._body) {
      this._body = this.raw.body.map(statement => th.convert(statement));
   }
    return this._body;
  }

}

export class ExpressionStatement extends Statement<babylon.ExpressionStatement> {

  private _expression: Expression<any>;

  get expression() {
    if (!this._expression) {
      this._expression = th.convert(this.raw.expression);
    }
    return this._expression;
  }

}

export class ReturnStatement extends Statement<babylon.ReturnStatement> {

  private _argument: Expression<any>;

  get argument() {
    if (!this._argument) {
      this._argument = th.convert(this.raw.argument);
    }
    return this._argument;
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
      this._declarations = this.raw.declarations.map(declaration => <VariableDeclarator>th.convert(declaration));
    }
    return this._declarations;
  }

}

export class VariableDeclarator extends Node<babylon.VariableDeclarator> {

  private _id: Identifier;

  private _init: Expression<any>;

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id);
    }
    return this._id;
  }

  get init() {
    if (!this._init) {
      this._init = th.convert(this.raw.init);
    }
    return this._init;
  }

}

export class ForOfStatement extends Statement<babylon.ForOfStatement> {

  private _left: Expression<any>;

  private _right: Expression<any>;

  private _body: Statement<any>;

  get left() {
    if (!this._left) {
      this._left = th.convert(this.raw.left);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right);
    }
    return this._right;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body);
    }
    return this._body;
  }

}

export class Expression<T> extends Node<T> {
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
      this._left = th.convert(this.raw.left);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right);
    }
    return this._right;
  }

}

export class ArrayExpression extends Expression<babylon.ArrayExpression> {

  private _elements: Expression<any>[];

  get elements() {
    if (!this._elements) {
      this._elements = this.raw.elements.map(expression => th.convert(expression));
    }
    return this._elements;
  }

}

export class SequenceExpression extends Expression<babylon.SequenceExpression> {

  private _expressions: Expression<any>[];

  get expressions() {
    if (!this._expressions) {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression));
    }
    return this._expressions;
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
      this._left = th.convert(this.raw.left);
    }
    return this._left;
  }

  get right() {
    if (!this._right) {
      this._right = th.convert(this.raw.right);
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
    if (!this._generator) {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id);
    }
    return this._id;
  }

  get params() {
    if (!this._params) {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param));
    }
    return this._params;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body);
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
    if (!this._generator) {
      this._generator = this.raw.generator;
    }
    return this._generator;
  }

  get id() {
    if (!this._id) {
      this._id = <Identifier>th.convert(this.raw.id);
    }
    return this._id;
  }

  get params() {
    if (!this._params) {
      this._params = this.raw.params.map(param => <Identifier>th.convert(param));
    }
    return this._params;
  }

  get body() {
    if (!this._body) {
      this._body = th.convert(this.raw.body);
    }
    return this._body;
  }

}

export class CallExpression extends Expression<babylon.CallExpression> {

  private _callee: Expression<any>;

  private _arguments: Expression<any>[];

  get callee() {
    if (!this._callee) {
      this._callee = th.convert(this.raw.callee);
    }
    return this._callee;
  }

  get arguments() {
    if (!this._arguments) {
      this._arguments = this.raw.arguments.map(argument => th.convert(argument));
    }
    return this._arguments;
  }

}

export class MemberExpression extends Expression<babylon.MemberExpression> {

  private _object: Node<any>;

  private _property: Node<any>;

  get object() {
    if (!this._object) {
      this._object = th.convert(this.raw.object);
    }
    return this._object;
  }

  get property() {
    if (!this._property) {
      this._property = th.convert(this.raw.property);
    }
    return this._property;
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

}

export class TemplateLiteral extends Expression<babylon.TemplateLiteral> {

  private _expressions: Expression<any>[];

  private _quasis: TemplateElement[];

  get expressions() {
    if (!this._expressions) {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression));
    }
    return this._expressions;
  }

  get quasis() {
    if (!this._quasis) {
      this._quasis = this.raw.quasis.map(quasi => <TemplateElement>th.convert(quasi));
    }
    return this._quasis;
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

}

export class Identifier extends Expression<babylon.Identifier> {

  private _name: string;

  get name() {
    if (!this._name) {
      this._name = this.raw.name;
    }
    return this._name;
  }

}
