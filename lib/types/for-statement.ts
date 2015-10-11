import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class ForStatement extends Statement<babylon.ForStatement> {

  private _init: Node<any>;

  private _test: Expression<any>;

  private _update: Expression<any>;

  private _body: Statement<any>;

  get init() {
    if (typeof this._init == 'undefined') {
      this._init = th.convert(this.raw.init, this);
    }
    return this._init;
  }

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get update() {
    if (typeof this._update == 'undefined') {
      this._update = th.convert(this.raw.update, this);
    }
    return this._update;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.init.visit(fn);
    this.test.visit(fn);
    this.update.visit(fn);
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `for (${this.init.toJavaScript()};${this.test.toJavaScript()};${this.update.toJavaScript()}) ${this.body.toJavaScript()}\n`;
  }

}
