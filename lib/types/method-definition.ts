import * as babylon from 'babylon';
import {Identifier} from './identifier';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class MethodDefinition extends Node<babylon.MethodDefinition> {

  private _key: Identifier;

  private _static: boolean;

  private _kind: string;

  private _value: Expression<babylon.Node>;

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

  get kind() {
    if (typeof this._kind == 'undefined') {
      this._kind = this.raw.kind;
    }
    return this._kind;
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
    return `${this.static ? 'static': ''} ${this.key.toJavaScript()} ${this.value.toJavaScript()}`;
  }

}
