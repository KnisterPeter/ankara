import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';

export class Identifier extends Expression<babylon.Identifier> {

  private _name: string;

  get name() {
    if (typeof this._name == 'undefined') {
      this._name = this.raw.name;
    }
    return this._name;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return this.name;
  }

}
