import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import {Statement} from './statement';
import * as th from '../type-helper';

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
