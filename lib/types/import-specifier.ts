import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class ImportSpecifier extends Node<babylon.ImportSpecifier> {

  private _imported: Identifier;

  private _local: Identifier;

  get imported() {
    if (typeof this._imported == 'undefined') {
      this._imported = <Identifier>th.convert(this.raw.imported, this);
    }
    return this._imported;
  }

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.imported.visit(fn);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    if (this.imported.name == this.local.name) {
      return `${this.imported.toJavaScript()}`;
    }
    return `${this.imported.toJavaScript()} as ${this.local.toJavaScript()}`;
  }

}
