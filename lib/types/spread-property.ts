import * as babylon from 'babylon';
import {Identifier} from './identifier';
import {Node} from './node';
import * as th from '../type-helper';

export class SpreadProperty extends Node<babylon.SpreadProperty> {

  private _argument: Identifier;

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = th.convert(this.raw.argument, this) as Identifier;
    }
    return this._argument;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.argument.visit(fn);
  }

  public toJavaScript(): string {
    return `...${this.argument.toJavaScript()}`;
  }

}
