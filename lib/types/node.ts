import * as babylon from 'babylon';

export abstract class Node<T extends babylon.Node> {

  private _instrumented: boolean;

  private _raw: T;

  private _parent: Node<any>;

  private _start: number;

  private _end: number;

  constructor(raw: T, parent?: Node<any>, instrumented = false) {
    this._raw = raw;
    this._parent = parent;
    this._instrumented = instrumented;
  }

  get raw() {
    return this._raw;
  }

  get parent() {
    return this._parent;
  }

  set parent(parent: Node<any>) {
    this._parent = parent;
  }

  get loc() {
    return this.raw.loc;
  }

  get start() {
    if (typeof this._start == 'undefined') {
      this._start = this.raw.start;
    }
    return this._start;
  }

  get end() {
    if (typeof this._end == 'undefined') {
      this._end = this.raw.end;
    }
    return this._end;
  }

  get instrumented() {
    return this._instrumented;
  }

  public instrument(path: string): void {
    throw new Error('Unsupported');
  }

  replaceWith(nodes: Node<any>|Node<any>[]) {
    this.parent.replaceChild(this, nodes);
  }

  protected replaceChild(source: Node<any>, dest: Node<any>|Node<any>[]) {
    throw new Error('Unsupported');
  }

  insertBefore(nodes: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(nodes)) {
      children = [].concat(nodes, this);
    } else {
      children = [nodes, this];
    }
    this.parent.replaceChild(this, children);
  }

  insertAfter(nodes: Node<any>|Node<any>[]) {
    let children;
    if (Array.isArray(nodes)) {
      children = [].concat(this, nodes);
    } else {
      children = [this, nodes];
    }
    this.parent.replaceChild(this, children);
  }

  public visit(fn: (node: Node<any>) => void): void {
    throw new Error('Unsupported');
  }

  public toJavaScript(): string {
    throw new Error('Unsupported');
  }

}
