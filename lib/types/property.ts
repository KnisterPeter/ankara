import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class Property extends Expression<babylon.Property> {

  private _method: boolean;

  private _shorthand: boolean;

  private _computed: boolean;

  private _key: Identifier;

  private _value: Node<any>;

  get method() {
    if (typeof this._method == 'undefined') {
      this._method = this.raw.method;
    }
    return this._method;
  }

  get shorthand() {
    if (typeof this._shorthand == 'undefined') {
      this._shorthand = this.raw.shorthand;
    }
    return this._shorthand;
  }

  get computed() {
    if (typeof this._computed == 'undefined') {
      this._computed = this.raw.computed;
    }
    return this._computed;
  }

  get key() {
    if (typeof this._key == 'undefined') {
      this._key = <Identifier>th.convert(this.raw.key, this);
    }
    return this._key;
  }

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = th.convert(this.raw.value, this);
    }
    return this._value;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.key.visit(fn);
    this.value.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.key.toJavaScript()}: ${this.value.toJavaScript()}`;
  }

}
