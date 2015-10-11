import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class RestElement extends Node<babylon.RestElement> {

  private _argument: Identifier;

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = <Identifier>th.convert(this.raw.argument, this);
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
