import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import {Literal} from './literal';
import * as th from '../type-helper';

export class AssignmentPattern extends Node<babylon.AssignmentPattern> {

  private _left: Identifier;
  private _right: Literal;

  get left() {
    if (typeof this._left == 'undefined') {
      this._left = th.convert(this.raw.left, this) as Identifier;
    }
    return this._left;
  }

  get right() {
    if (typeof this._right == 'undefined') {
      this._right = th.convert(this.raw.right, this) as Literal;
    }
    return this._right;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.left.visit(fn);
    this.right.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.left.toJavaScript()} = ${this.right.toJavaScript()}`;
  }

}
