import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import {Statement} from './statement';
import {MethodDefinition} from './method-definition';
import * as th from '../type-helper';

export class FunctionExpression extends Expression<babylon.FunctionExpression> {

  private _generator: boolean;

  private _expression: boolean;

  private _async: boolean;

  private _id: Identifier;
  
  private _params: Identifier[];
  
  private _body: Statement<any>;

  private _parenthesizedExpression: boolean;

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

  get async() {
    if (typeof this._async == 'undefined') {
      this._async = this.raw.async;
    }
    return this._async;
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

  get parenthesizedExpression() {
    if (typeof this._parenthesizedExpression == 'undefined') {
      this._parenthesizedExpression = this.raw.parenthesizedExpression;
    }
    return this._parenthesizedExpression;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id && this.id.visit(fn);
    this.params.forEach(param => param.visit(fn));
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    const keyword = this.parent instanceof MethodDefinition
      ? ''
      : `function${this.generator ? '*' : ''}`;
    let code = `${this.async ? 'async': ''} ${keyword} ${this.id ? this.id.toJavaScript() : ''}(${this.params.map(param => param.toJavaScript()).join(', ')}) ${this.body.toJavaScript()}`;
    if (this.parenthesizedExpression) {
      code = `(${code})`;
    }
    return code;
  }

}
