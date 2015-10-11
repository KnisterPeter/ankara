import * as babylon from 'babylon';
import {Node} from './node';
import {Program} from './program';
import * as th from '../type-helper';

export class File extends Node<babylon.File> {

  private _program: Program;

  get program() {
    if (typeof this._program == 'undefined') {
      this._program = <Program>th.convert(this.raw.program, this);
    }
    return this._program;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.program.visit(fn);
  }

  public toJavaScript(): string {
    return this.program.toJavaScript();
  }

}
