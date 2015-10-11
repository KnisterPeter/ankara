import * as babylon from 'babylon';
import {Expression} from './expression';
import {Node} from './node';

export class ThisExpression extends Expression<babylon.ThisExpression> {

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return 'this';
  }

}
