import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';

import {SimpleClass, ExtendedClass} from './classes';
import {asyncFunction} from './async-functions';
import {assignment, logical} from './expressions';
import {selfCalling} from './functions';
import {newlines, extendedObjectLiterals} from './literals';
// Will not work since we insert the coverage-lib as import and imports don't have a global this
// Therefore this breaks in babel after instrumentation
// https://babeljs.io/docs/faq/#why-is-this-being-remapped-to-undefined-
//import './jquery-1.11.3.js';
import {arraySpread, destructuredArray, restParameter, spreadParameter, objectSpread, destructuredObject} from './spread';

test('parsing and regenerating classes', t => {
  let instance = new SimpleClass();
  t.ok(SimpleClass.staticMethod);
  t.ok(instance.method);
  t.end();
});

test('parsing and regenerating classes with properties', t => {
  let instance = new ExtendedClass();
  t.equal(ExtendedClass.staticProperty, 0);
  t.equal(instance.property, 0);
  t.end();
});

test('parsing and generation of async functions', t => {
  asyncFunction().then(() => t.end());
});

test('parenthesis around assingment and logical expression should be minimal', t => {
  t.notOk(assignment(true, false));
  t.end();
});

test('parenthesis in logical expressions should be minimal', t => {
  t.ok(logical(true, false, true, true));
  t.end();
});

test('self-calling functions should be in parenthesis', t => {
  selfCalling(() => t.end());
});

test('literals with escaped characters should stay escaped', t => {
  t.equal(newlines(), '\r\n\t\\n');
  t.end();
});

test('creating of extended object literals', t => {
  let literal = extendedObjectLiterals();
  t.deepEqual(Object.keys(literal), ['a', 'b', 'test']);
  t.equal(literal.test(), 'test');
  t.end();
});

test('array creating with spread operator', t => {
  t.deepEqual(arraySpread(), [0, 1, 2, 'a', 'b', 'c']);
  t.end();
});

test('array destructuring', t => {
  t.equal(destructuredArray(), 'c');
  t.end();
});

test('restParameters', t => {
  t.deepEqual(restParameter('a', 'b', 'c', 'd'), ['c', 'd']);
  t.end();
});

test('spreadParameters', t => {
  t.equal(spreadParameter(), 3);
  t.end();
});

test('objectSpread', t => {
  t.deepEqual(objectSpread(), {key1: 'value1', key2: 'value3'});
  t.end();
});

test('destructuredObject', t => {
  t.equal(destructuredObject(), 'value2');
  t.end();
});
