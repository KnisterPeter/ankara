import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';
import {loadCoverageData, containsLine} from '../helper';

import * as stmts from './statements';
import * as vars from './variable-declarations';

test('expression statements should be instrumented', (t) => {
  t.plan(2);

  stmts.expressionStatement();

  const fileData = loadCoverageData('tests/instrumentation/statements.js');
  t.ok(containsLine(fileData.statements, 2), 'Line 2 should be coverable');
  t.ok(containsLine(fileData.lines, 2), 'Line 2 should be covered');
});

test('return statements should be instrumented', (t) => {
  t.plan(3);

  t.equal(stmts.returnStatement(), 'Hello World!');

  const fileData = loadCoverageData('tests/instrumentation/statements.js');
  t.ok(containsLine(fileData.statements, 6), 'Line 6 should be coverable');
  t.ok(containsLine(fileData.lines, 6), 'Line 6 should be covered');
});

test('variable declarations should be instrumented', (t) => {
  t.plan(6);

  vars.variableDeclarations();

  const fileData = loadCoverageData('tests/instrumentation/variable-declarations.js');
  t.ok(containsLine(fileData.statements, 2), 'Line 2 should be coverable');
  t.ok(containsLine(fileData.lines, 2), 'Line 2 should be covered');
  t.ok(containsLine(fileData.statements, 3), 'Line 3 should be coverable');
  t.ok(containsLine(fileData.lines, 3), 'Line 3 should be covered');
  t.ok(containsLine(fileData.statements, 4), 'Line 4 should be coverable');
  t.ok(containsLine(fileData.lines, 4), 'Line 4 should be covered');
});

test('expression statements in arrow functions should be instrumented', (t) => {
  t.plan(2);

  stmts.arrowFunctionWithExpressionStatement();

  const fileData = loadCoverageData('tests/instrumentation/statements.js');
  t.ok(containsLine(fileData.statements, 10), 'Line 10 should be coverable');
  t.ok(containsLine(fileData.lines, 10), 'Line 10 should be covered');
});
