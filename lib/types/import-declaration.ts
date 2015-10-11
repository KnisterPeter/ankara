import * as babylon from 'babylon';
import {Statement} from './statement';
import {Node} from './node';
import {ImportSpecifier} from './import-specifier';
import {ImportNamespaceSpecifier} from './import-namespace-specifier';
import * as th from '../type-helper';

export class ImportDeclaration extends Statement<babylon.ImportDeclaration> {

  private _importKind: string;

  private _specifiers: ImportNamespaceSpecifier[];

  private _source: Node<any>;

  get importKind() {
    if (typeof this._importKind == 'undefined') {
      this._importKind = this.raw.importKind;
    }
    return this._importKind;
  }

  get specifiers() {
    if (typeof this._specifiers == 'undefined') {
      this._specifiers = this.raw.specifiers.map(specifier => <ImportNamespaceSpecifier>th.convert(specifier, this));
    }
    return this._specifiers;
  }

  get source() {
    if (typeof this._source == 'undefined') {
      this._source = th.convert(this.raw.source, this);
    }
    return this._source;
  }

  public visit(fn: (node: Node<any>) => void): void {
    fn(this);
    this.specifiers.forEach(specifier => specifier.visit(fn));
    this.source.visit(fn);
  }

  public toJavaScript(): string {
    let imports = [];
    let namedImports = this.specifiers
      .filter(specifier => specifier instanceof ImportSpecifier)
      .map(specifier => specifier.toJavaScript())
      .join(', ');
    if (namedImports) {
      imports.push(`{${namedImports}}`);
    }
    let otherImports = this.specifiers
      .filter(specifier => !(specifier instanceof ImportSpecifier))
      .map(specifier => specifier.toJavaScript())
      .join(', ');
    if (otherImports) {
      imports.push(otherImports);
    }
    return `import ${imports.join(', ')} from ${this.source.toJavaScript()};\n`;
  }

}
