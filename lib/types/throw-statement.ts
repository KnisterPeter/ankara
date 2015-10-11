import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import {Expression} from './expression';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class ThrowStatement extends Statement<babylon.ThrowStatement> {

  private _argument: Expression<any>;

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
    return `throw ${this.argument.toJavaScript()};`;
  }

}
