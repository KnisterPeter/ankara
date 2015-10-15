import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class WhileStatement extends Statement<babylon.WhileStatement> {

  private _test: Expression<any>;

  private _body: Statement<any>;

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.test.visit(fn);
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `while (${this.test.toJavaScript()}) ${this.body.toJavaScript()}\n`;
  }

}
