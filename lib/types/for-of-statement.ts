import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

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
