import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class AwaitExpression extends Expression<babylon.AwaitExpression> {

  private _all: boolean;

  private _argument: Expression<babylon.Node>;

  get all() {
    if (typeof this._all == 'undefined') {
      this._all = this.raw.all;
    }
    return this._all;
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
    return `await ${this.argument.toJavaScript()}`;
  }

}
