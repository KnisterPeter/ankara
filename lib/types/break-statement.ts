import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class BreakStatement extends Statement<babylon.BreakStatement> {

  private _label: Identifier;

  get label() {
    if (typeof this._label == 'undefined' && this.raw.label) {
      this._label = <Identifier>th.convert(this.raw.label, this);
    }
    return this._label;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.label) {
      this.label.visit(fn);
    }
  }

  public toJavaScript(): string {
    return `break ${this.label ? this.label.toJavaScript() : ''};`;
  }

}
