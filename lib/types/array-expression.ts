import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class ArrayExpression extends Expression<babylon.ArrayExpression> {

  private _elements: Expression<any>[];

  get elements() {
    if (typeof this._elements == 'undefined') {
      this._elements = this.raw.elements.map(expression => th.convert(expression, this));
    }
    return this._elements;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.elements.forEach(element => element.visit(fn));
  }

  public toJavaScript(): string {
    return `[${this.elements.map(element => element.toJavaScript()).join(', ')}]`;
  }

}
