/// <reference path="../typings/references.d.ts" />
import * as babylon from 'babylon';

export abstract class Node {

  private _raw: babylon.Node;

  constructor(raw: babylon.Node) {
    this._raw = raw;
  }

  get raw() {
    return this._raw;
  }

}

export class File extends Node {
  raw: babylon.File;
}

export class Program extends Node {
  raw: babylon.Program;
}

export abstract class Statement extends Node {
  raw: babylon.Statement;
}

export class ImportDeclaration extends Statement {
  raw: babylon.ImportDeclaration;
}

export class ImportNamespaceSpecifier extends Node {
  raw: babylon.ImportNamespaceSpecifier;
}

export class ExportDefaultDeclaration extends Statement {
  raw: babylon.ExportDefaultDeclaration;
}

export class ExportNamedDeclaration extends Statement {
  raw: babylon.ExportNamedDeclaration;
}

export class BlockStatement extends Statement {
  raw: babylon.BlockStatement;
}

export class ExpressionStatement extends Statement {
  raw: babylon.ExpressionStatement;
}

export class ReturnStatement extends Statement {
  raw: babylon.ReturnStatement;
}

export class VariableDeclaration extends Statement {
  raw: babylon.VariableDeclaration;
}

export class VariableDeclarator extends Node {
  raw: babylon.VariableDeclarator;
}

export class ForOfStatement extends Statement {
  raw: babylon.ForOfStatement;
}

export abstract class Expression extends Node {
  raw: babylon.Expression;
}

export class AssignmentExpression extends Expression {
  raw: babylon.AssignmentExpression;
}

export class ArrayExpression extends Expression {
  raw: babylon.ArrayExpression;
}

export class SequenceExpression extends Expression {
  raw: babylon.SequenceExpression;
}

export class BinaryExpression extends Expression {
  raw: babylon.BinaryExpression;
}

export class FunctionExpression extends Expression {
  raw: babylon.FunctionExpression;
}

export class FunctionDeclaration extends Expression {
  raw: babylon.FunctionDeclaration;
}

export class CallExpression extends Expression {
  raw: babylon.CallExpression;
}

export class MemberExpression extends Expression {
  raw: babylon.MemberExpression;
}

export class Literal extends Expression {
  raw: babylon.Literal;
}

export class TemplateLiteral extends Expression {
  raw: babylon.TemplateLiteral;
}

export class TemplateElement extends Node {
  raw: babylon.TemplateElement;
}

export class Identifier extends Expression {
  raw: babylon.Identifier;
}
