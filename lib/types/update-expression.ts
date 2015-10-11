import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class UpdateExpression extends Node<babylon.UpdateExpression> {

  private _operator: string;

  private _prefix: boolean;

  private _argument: Identifier;

  get operator() {
    if (typeof this._operator == 'undefined') {
      this._operator = this.raw.operator;
    }
    return this._operator;
  }

  get prefix() {
    if (typeof this._prefix == 'undefined') {
      this._prefix = this.raw.prefix;
    }
    return this._prefix;
  }

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
    return `${this.prefix ? this.operator : ''}${this.argument.toJavaScript()}${!this.prefix ? this.operator : ''}`;
  }

}
