import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';

export class Literal extends Expression<babylon.Literal> {

  private _value: string|number;

  private _rawValue: string|number;

  // private _raw: string;

  get value() {
    if (typeof this._value == 'undefined') {
      this._value = this.raw.value;
    }
    return this._value;
  }

  get rawValue() {
    if (typeof this._rawValue == 'undefined') {
      this._rawValue = this.raw.rawValue;
    }
    return this._rawValue;
  }

  // get raw() {
  //   if (typeof this._raw == 'undefined') {
  //     this._raw = this.raw.raw;
  //   }
  //   return this._raw;
  // }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    let str = this.value;
    if (typeof str === 'string') {
      str = "'" + (<string>str).replace(/'/g, "\\'") + "'";
    } else if (this.value === null) {
      str = 'null';
    }
    return <string>str;
  }

}