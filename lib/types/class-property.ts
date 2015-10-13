import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class ClassProperty extends Node<babylon.ClassProperty> {

  private _computed: boolean;

  private _key: Identifier;

  private _static: boolean;

  private _value: Node<babylon.Node>;

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

  get static() {
    if (typeof this._static == 'undefined') {
      this._static = this.raw.static;
    }
    return this._static;
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
    return `${this.static ? 'static': ''} ${this.key.toJavaScript()} = ${this.value.toJavaScript()};\n`;
  }

}
