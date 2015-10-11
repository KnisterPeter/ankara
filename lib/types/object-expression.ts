import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Property} from './property';
import * as th from '../type-helper';

export class ObjectExpression extends Expression<babylon.ObjectExpression> {

  private _properties: Property[];

  get properties() {
    if (typeof this._properties == 'undefined') {
      this._properties = this.raw.properties.map(property => <Property>th.convert(property, this));
    }
    return this._properties;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.properties.forEach(property => property.visit(fn));
  }

  public toJavaScript(): string {
    return `{${this.properties.map(property => property.toJavaScript()).join(', ')}}`;
  }

}
