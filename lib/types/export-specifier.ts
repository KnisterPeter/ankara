import * as babylon from 'babylon';
import {Identifier} from './identifier';
import {Node} from './node';
import * as th from '../type-helper';

export class ExportSpecifier extends Node<babylon.ExportSpecifier> {

  private _local: Identifier;

  private _exported: Identifier;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  get exported() {
    if (typeof this._exported == 'undefined') {
      this._exported = <Identifier>th.convert(this.raw.exported, this);
    }
    return this._exported;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.local.visit(fn);
    this.exported.visit(fn);
  }

  public toJavaScript(): string {
    return this.exported.toJavaScript();
  }

}
