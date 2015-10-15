import * as babylon from 'babylon';
import {Statement} from './statement';
import {CatchClause} from './catch-clause';
import {BlockStatement} from './block-statement';
import {Node} from './node';
import * as th from '../type-helper';

export class TryStatement extends Statement<babylon.TryStatement> {

  private _block: BlockStatement;

  private _handler: CatchClause;

  get block() {
    if (typeof this._block == 'undefined') {
      this._block = <BlockStatement>th.convert(this.raw.block, this);
    }
    return this._block;
  }

  get handler() {
    if (typeof this._handler == 'undefined') {
      this._handler = <CatchClause>th.convert(this.raw.handler, this);
    }
    return this._handler;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.block.visit(fn);
    this.handler.visit(fn);
  }

  public toJavaScript(): string {
    return `try ${this.block.toJavaScript()} ${this.handler.toJavaScript()}\n`;
  }

}
