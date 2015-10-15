import * as babylon from 'babylon';
import {Statement} from './statement';
import {Identifier} from './identifier';
import {Node} from './node';
import * as th from '../type-helper';

export class ContinueStatement extends Statement<babylon.ContinueStatement> {

  private _label: Identifier;

  get label() {
    if (typeof this._label == 'undefined') {
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
    const label = this.label ? this.label.toJavaScript() : '';
    return `continue ${label};\n`;
  }

}
