import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import {VariableDeclarator} from './variable-declarator';
import {ExpressionStatement} from './expression-statement';
import {ForOfStatement} from './for-of-statement';
import {ForStatement} from './for-statement';
import {ExportNamedDeclaration} from './export-named-declaration';
import * as th from '../type-helper';
import {parseFragment} from '../parser';

export class VariableDeclaration extends Statement<babylon.VariableDeclaration> {

  private _kind: string;

  private _declarations: VariableDeclarator[];

  constructor(raw: babylon.VariableDeclaration, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get kind() {
    if (typeof this._kind == 'undefined') {
      this._kind = this.raw.kind;
    }
    return this._kind;
  }

  get declarations() {
    if (typeof this._declarations == 'undefined') {
      this._declarations = this.raw.declarations.map(declaration => <VariableDeclarator>th.convert(declaration, this));
    }
    return this._declarations;
  }

  public instrument(path: string): void {
    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    if (this.parent instanceof ForOfStatement
        || this.parent instanceof ForStatement
        || this.parent instanceof ExportNamedDeclaration) {
      this.parent.insertBefore(fragment);
    } else {
      this.insertBefore(fragment);
    }
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.declarations.forEach(declaration => declaration.visit(fn));
  }

  public toJavaScript(): string {
    const isStatement = !(this.parent instanceof ForOfStatement || this.parent instanceof ForStatement);
    return `${this.kind} ${this.declarations.map(declaration => declaration.toJavaScript()).join(', ')}${isStatement ? ';': ''}`;
  }

}
