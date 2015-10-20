import * as babylon from 'babylon';
import {Identifier} from './identifier';
import {Node} from './node';
import * as th from '../type-helper';

export class ArrayPattern extends Node<babylon.ArrayPattern> {

  private _elements: Identifier[];

  get elements() {
    if (typeof this._elements == 'undefined') {
      this._elements = this.raw.elements.map(element => th.convert(element, this) as Identifier);
    }
    return this._elements;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.elements.forEach(element => element && element.visit(fn));
  }

  public toJavaScript(): string {
    return `[${this.elements.map(element => element != null ? element.toJavaScript(): '').join(', ')}]`;
  }

}
