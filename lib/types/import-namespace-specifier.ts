import * as babylon from 'babylon';
import {Node} from './node';
import * as th from '../type-helper';

export class ImportNamespaceSpecifier extends Node<babylon.ImportNamespaceSpecifier> {

  private _local: Node<any>;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    return `* as ${this.local.toJavaScript()}`;
  }

}
