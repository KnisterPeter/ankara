import * as babylon from 'babylon';
import {Statement} from './statement';
import {BlockStatement} from './block-statement';
import {Identifier} from './identifier';
import {Node} from './node';
import * as th from '../type-helper';

export class CatchClause extends Node<babylon.CatchClause> {

  private _param: Identifier;

  private _body: BlockStatement;

  get param() {
    if (typeof this._param == 'undefined') {
      this._param = <Identifier>th.convert(this.raw.param, this);
    }
    return this._param;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = <BlockStatement>th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.param.visit(fn);
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    return `catch (${this.param.toJavaScript()}) ${this.body.toJavaScript()}`;
  }

}
