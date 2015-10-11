import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import * as th from '../type-helper';

export class ImportDefaultSpecifier extends Node<babylon.ImportDefaultSpecifier> {

  private _local: Identifier;

  get local() {
    if (typeof this._local == 'undefined') {
      this._local = <Identifier>th.convert(this.raw.local, this);
    }
    return this._local;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.local.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.local.toJavaScript()}`;
  }

}
