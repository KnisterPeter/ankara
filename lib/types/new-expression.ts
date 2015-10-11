import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class NewExpression extends Expression<babylon.NewExpression> {

  private _callee: Node<any>;

  private _arguments: Identifier[];

  get callee() {
    if (typeof this._callee == 'undefined') {
      this._callee = th.convert(this.raw.callee, this);
    }
    return this._callee;
  }

  get arguments() {
    if (typeof this._arguments == 'undefined') {
      this._arguments = this.raw.arguments.map(argument => <Identifier>th.convert(argument, this));
    }
    return this._arguments;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.callee.visit(fn);
    this.arguments.forEach(argument => argument.visit(fn));
  }

  public toJavaScript(): string {
    return `new ${this.callee.toJavaScript()}(${this.arguments.map(argument => argument.toJavaScript()).join(', ')})`;
  }

}
