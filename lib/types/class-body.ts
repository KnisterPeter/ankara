import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class ClassBody extends Node<babylon.ClassBody> {

  private _body: Node<babylon.Node>[];

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = this.raw.body.map(node => <Node<babylon.Node>>th.convert(node, this));
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.body.forEach(node => node.visit(fn));
  }

  public toJavaScript(): string {
    return `{\n${this.body.map(node => node.toJavaScript()).join('\n')}}\n`;
  }

}
