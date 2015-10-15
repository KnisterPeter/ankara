import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class LogicalExpression extends Expression<babylon.LogicalExpression> {

  private _left: Expression<any>;

  private _operator: string;

  private _right: Expression<any>;

  private _parenthesizedExpression: boolean;

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

  get parenthesizedExpression() {
    if (typeof this._parenthesizedExpression == 'undefined') {
      this._parenthesizedExpression = this.raw.parenthesizedExpression;
    }
    return this._parenthesizedExpression;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
  }

  public toJavaScript(): string {
    let code = `${this.left.toJavaScript()} ${this.operator} ${this.right.toJavaScript()}`;
    if (this.parenthesizedExpression) {
      code = `(${code})`;
    }
    return code;
  }

}
