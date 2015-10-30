import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import * as th from '../type-helper';

export class ExportNamedDeclaration extends Statement<babylon.ExportNamedDeclaration> {

  private _specifiers: Node<any>[];

  private _declaration: Expression<any>;

  get specifiers() {
    if (typeof this._specifiers == 'undefined') {
      this._specifiers = this.raw.specifiers.map(specifier => th.convert(specifier, this));
    }
    return this._specifiers;
  }

  get declaration() {
    if (typeof this._declaration == 'undefined') {
      this._declaration = th.convert(this.raw.declaration, this);
    }
    return this._declaration;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.specifiers) {
      this.specifiers.forEach(specifier => specifier.visit(fn));
    }
    if (this.declaration) {
      this.declaration.visit(fn);
    }
  }

  public toJavaScript(): string {
    let specifiers = '';
    if (this.specifiers && this.specifiers.length > 0) {
      specifiers = `{${this.specifiers.map(specifier => specifier.toJavaScript()).join(', ')}}`;
    }
    let declaration = '';
    if (this.declaration) {
      declaration = this.declaration.toJavaScript();
    }
    return `export ${specifiers}${declaration}\n`;
  }

}
