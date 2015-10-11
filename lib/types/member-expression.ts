import * as babylon from 'babylon';
import {Identifier} from './identifier';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class MemberExpression extends Expression<babylon.MemberExpression> {

  private _object: Node<any>;

  private _property: Node<any>;

  get object() {
    if (typeof this._object == 'undefined') {
      this._object = th.convert(this.raw.object, this);
    }
    return this._object;
  }

  get property() {
    if (typeof this._property == 'undefined') {
      this._property = th.convert(this.raw.property, this);
    }
    return this._property;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.object.visit(fn);
    this.property.visit(fn);
  }

  public toJavaScript(): string {
    const property = this.property;
    if (!(property instanceof Identifier)) {
      return `${this.object.toJavaScript()}[${property.toJavaScript()}]`;
    }
    return `${this.object.toJavaScript()}.${property.toJavaScript()}`;
  }

}
