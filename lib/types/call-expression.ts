import * as babylon from 'babylon';
import {Expression} from './expression';
import {FunctionExpression} from './function-expression';
import {Node} from './node';
import * as th from '../type-helper';

export class CallExpression extends Expression<babylon.CallExpression> {

  private _callee: Expression<any>;

  private _arguments: Expression<any>[];

  get callee() {
    if (typeof this._callee == 'undefined') {
      this._callee = th.convert(this.raw.callee, this);
    }
    return this._callee;
  }

  get arguments() {
    if (typeof this._arguments == 'undefined') {
      this._arguments = this.raw.arguments.map(argument => th.convert(argument, this));
    }
    return this._arguments;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.callee.visit(fn);
    this.arguments.forEach(arg => arg.visit(fn));
  }

  public toJavaScript(): string {
    let callee = this.callee.toJavaScript();
    return `${callee}(${this.arguments.map(arg => arg.toJavaScript()).join(', ')})`;
  }

}
