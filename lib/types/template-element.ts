import * as babylon from 'babylon';
import {Node} from './node';

export class TemplateElement extends Node<babylon.TemplateElement> {

  private _value: { raw: string; cooked: string };

  private _tail: boolean;

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get tail() {
    if (typeof this._tail == 'undefined') {
      this._tail = this.raw.tail;
    }
    return this._tail;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return this.value.raw;
  }

}
