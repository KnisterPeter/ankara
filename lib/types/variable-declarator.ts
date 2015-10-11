import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class VariableDeclarator extends Node<babylon.VariableDeclarator> {

  private _id: Identifier;

  private _init: Expression<any>;

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get init() {
    if (typeof this._init == 'undefined') {
      this._init = th.convert(this.raw.init, this);
    }
    return this._init;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.id.visit(fn);
    if (this.init != null) {
      this.init.visit(fn);
    }
  }

  public toJavaScript(): string {
    return `${this.id.toJavaScript()}${this.init != null ? ` = ${this.init.toJavaScript()}` : ''}`;
  }

}
