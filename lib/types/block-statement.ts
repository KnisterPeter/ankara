import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import * as th from '../type-helper';

export class BlockStatement extends Statement<babylon.BlockStatement> {

  private _body: Statement<any>[];

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = this.raw.body.map(statement => th.convert(statement, this));
   }
    return this._body;
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    if (Array.isArray(dest)) {
      (<Node<any>[]>dest).forEach(node => node.parent = this);
    } else {
      (<Node<any>>dest).parent = this;
    }
    let idx = this._body.indexOf(source);
    this._body = [].concat(
      this._body.slice(0, idx),
      dest,
      this._body.slice(idx + 1, this._body.length)
    );
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.body.forEach(statement => statement.visit(fn));
  }

  public toJavaScript(): string {
    return `{\n${this.body.map(statement => statement.toJavaScript()).join('\n')}}\n`;
  }

}
