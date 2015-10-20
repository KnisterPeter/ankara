import * as babylon from 'babylon';
import {Property} from './property';
import {Node} from './node';
import * as th from '../type-helper';

export class ObjectPattern extends Node<babylon.ObjectPattern> {

  private _properties: Property[];

  get properties() {
    if (typeof this._properties == 'undefined') {
      this._properties = this.raw.properties.map(element => th.convert(element, this) as Property);
    }
    return this._properties;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.properties.forEach(element => element && element.visit(fn));
  }

  public toJavaScript(): string {
    return `{${this.properties.map(element => element != null ? element.toJavaScript(): '').join(', ')}}`;
  }

}
