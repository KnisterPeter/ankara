import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

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
