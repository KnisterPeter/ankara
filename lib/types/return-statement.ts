import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {ExpressionStatement} from './expression-statement';
import {Node} from './node';
import {parseFragment} from '../parser';
import * as th from '../type-helper';

export class ReturnStatement extends Statement<babylon.ReturnStatement> {

  private _argument: Expression<any>;

  constructor(raw: babylon.ReturnStatement, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get argument() {
    if (typeof this._argument == 'undefined') {
      this._argument = th.convert(this.raw.argument, this);
    }
    return this._argument;
  }

  public instrument(path: string): void {
    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    if (this.argument) {
      this.argument.replaceWith(
        th.sequenceExpression([
          fragment.expression,
          this.argument
        ])
      );
    } else {
      this.insertBefore(fragment);
    }
  }

  protected replaceChild(source: Node<any>, dest: Node<any> | Node<any>[]) {
    if (Array.isArray(dest)) {
      throw new Error('Not supported');
    } else {
      (<Node<any>>dest).parent = this;
      this._argument = <Node<any>>dest;
    }
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    if (this.argument) {
      this.argument.visit(fn);
    }
  }

  public toJavaScript(): string {
    return `return ${this.argument ? this.argument.toJavaScript() : ''};\n`;
  }

}
