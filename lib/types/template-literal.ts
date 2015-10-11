import * as babylon from 'babylon';
import * as th from '../type-helper';
import {TemplateElement} from './template-element';
import {Expression} from './expression';
import {Node} from './node';

export class TemplateLiteral extends Expression<babylon.TemplateLiteral> {

  private _expressions: Expression<any>[];

  private _quasis: TemplateElement[];

  get expressions() {
    if (typeof this._expressions == 'undefined') {
      this._expressions = this.raw.expressions.map(expression => th.convert(expression, this));
    }
    return this._expressions;
  }

  get quasis() {
    if (typeof this._quasis == 'undefined') {
      this._quasis = this.raw.quasis.map(quasi => <TemplateElement>th.convert(quasi, this));
    }
    return this._quasis;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    [].concat(this.quasis, this.expressions)
      .sort((a, b) => a.start - b.start)
      .forEach(node => node.visit(fn));
  }

  public toJavaScript(): string {
    return '`' + ([].concat(this.quasis, this.expressions))
      .sort((a, b) => a.start - b.start)
      .map(node => {
        if (!(node instanceof TemplateElement)) {
          return '${' + node.toJavaScript() + '}';
        }
        return node.toJavaScript();
      })
      .join('') + '`';
  }

}
