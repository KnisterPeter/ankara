import * as babylon from 'babylon';
import {Node} from './node';
import {Identifier} from './identifier';
import {ClassBody} from './class-body';
import * as th from '../type-helper';

export class ClassDeclaration extends Node<babylon.ClassDeclaration> {

  private _id: Identifier;

  private _superClass: Node<babylon.Node>;

  private _body: ClassBody;

  get id() {
    if (typeof this._id == 'undefined') {
      this._id = <Identifier>th.convert(this.raw.id, this);
    }
    return this._id;
  }

  get superClass() {
    if (typeof this._superClass == 'undefined') {
      this._superClass = th.convert(this.raw.superClass, this);
    }
    return this._superClass;
  }

  get body() {
    if (typeof this._body == 'undefined') {
      this._body = <ClassBody>th.convert(this.raw.body, this);
    }
    return this._body;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.id) {
      this.id.visit(fn);
    }
    if (this.superClass) {
      this.superClass.visit(fn);
    }
    this.body.visit(fn);
  }

  public toJavaScript(): string {
    const id = this.id ? this.id.toJavaScript() : '';
    const superClass = this.superClass ? 'extends ' + this.superClass.toJavaScript() : '';
    return `class ${id} ${superClass} ${this.body.toJavaScript()}`;
  }

}
