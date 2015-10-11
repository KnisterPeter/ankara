import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class ExportDefaultDeclaration extends Statement<babylon.ExportDefaultDeclaration> {

  private _declaration: Expression<any>;

  get declaration() {
    if (typeof this._declaration == 'undefined') {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.declaration.visit(fn);
  }

  public toJavaScript(): string {
    return `export default ${this.declaration.toJavaScript()}\n`;
  }

}
