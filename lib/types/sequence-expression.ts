import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class SequenceExpression extends Expression<babylon.SequenceExpression> {

  private _expressions: Expression<any>[];

  get expressions() {
    if (typeof this._expressions == 'undefined') {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression, this));
    }
    return this._expressions;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(dest)) {
      children = <Node<any>[]>dest;
    } else {
      children = [dest];
    }
    children.forEach(node => node.parent = this);
    this._expressions = children;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.expressions.forEach(expression => expression.visit(fn));
  }

  public toJavaScript(): string {
    return `(${this.expressions.map(expression => expression.toJavaScript()).join(', ')})`;
  }

}
