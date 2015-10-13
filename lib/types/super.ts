import * as babylon from 'babylon';
import {Node} from './node';
import * as th from '../type-helper';

export class Super extends Node<babylon.Super> {

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
  }

  public toJavaScript(): string {
    return `super`;
  }

}
