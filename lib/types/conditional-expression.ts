import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class ConditionalExpression extends Expression<babylon.ConditionalExpression> {

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
