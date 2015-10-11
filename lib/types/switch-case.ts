import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import * as th from '../type-helper';

export class SwitchCase extends Node<babylon.SwitchCase> {

  private _test: Node<any>;

  private _consequent: Statement<any>[];

  get test() {
    if (typeof this._test == 'undefined') {
      this._test = th.convert(this.raw.test, this);
    }
    return this._test;
  }

  get consequent() {
    if (typeof this._consequent == 'undefined') {
      this._consequent = this.raw.consequent.map(_case => th.convert(_case, this));
    }
    return this._consequent;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.test) {
      this.test.visit(fn);
    }
    this.consequent.forEach(consequent => consequent.visit(fn));
  }

  public toJavaScript(): string {
    let source;
    if (this.test === null) {
      source = `default:\n`;
    } else {
      source = `case ${this.test.toJavaScript()}:\n`;
    }
    return `${source}${this.consequent.map(consequent => consequent.toJavaScript()).join('\n')}`;
  }

}
