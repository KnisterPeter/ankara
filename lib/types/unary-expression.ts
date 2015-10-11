import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

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
