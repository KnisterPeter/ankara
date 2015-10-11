import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {Node} from './node';
import {CallExpression} from './call-expression';
import {MemberExpression} from './member-expression';
import {Identifier} from './identifier';
import {parseFragment} from '../parser';
import * as th from '../type-helper';

export class ExpressionStatement extends Statement<babylon.ExpressionStatement> {

  private _expression: Expression<any>;

  constructor(raw: babylon.ExpressionStatement, parent?: Node<any>) {
    super(raw, parent, true);
  }

  get expression() {
    if (typeof this._expression == 'undefined') {
      this._expression = th.convert(this.raw.expression, this);
    }
    return this._expression;
  }

  public instrument(path: string): void {
    // Guard of own code...
    const expression = this.expression;
    if (expression instanceof CallExpression) {
      let expression2: Node<any> = expression.callee;
      while (expression2 instanceof MemberExpression) {
        expression2 = (<MemberExpression>expression2).object;
      }
      if (expression2 instanceof Identifier) {
        if (expression2.name === '__$c') {
          return;
        }
      }
    }

    let fragment = <ExpressionStatement>parseFragment(`__$c.statement("${path}", ${this.loc.start.line})`)[0];
    this.replaceWith(
      th.expressionStatement(
        th.sequenceExpression([
          fragment.expression,
          this.expression
        ])
      )
    );
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.expression.visit(fn);
  }

  public toJavaScript(): string {
    return `${this.expression.toJavaScript()};\n`;
  }

}
