import * as babylon from 'babylon';
import {Statement} from './statement';
import {Expression} from './expression';
import {SwitchCase} from './switch-case';
import {Node} from './node';
import * as th from '../type-helper';

export class SwitchStatement extends Statement<babylon.SwitchStatement> {

  private _discriminant: Expression<any>;

  private _cases: SwitchCase[];

  get discriminant() {
    if (typeof this._discriminant == 'undefined') {
      this._discriminant = th.convert(this.raw.discriminant, this);
    }
    return this._discriminant;
  }

  get cases() {
    if (typeof this._cases == 'undefined') {
      this._cases = this.raw.cases.map(_case => <SwitchCase>th.convert(_case, this));
    }
    return this._cases;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.discriminant.visit(fn);
    this.cases.forEach(_case => _case.visit(fn));
  }

  public toJavaScript(): string {
    return `switch (${this.discriminant.toJavaScript()}) { ${this.cases.map(_case => _case.toJavaScript()).join('')} }`;
  }

}
