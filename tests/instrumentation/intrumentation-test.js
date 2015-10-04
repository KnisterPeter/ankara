import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';
import {loadCoverageData} from '../helper';

import * as stmts from './statements';
import * as vars from './variable-declarations';

test('expression statements should be instrumented', (t) => {
  t.plan(2);

  stmts.expressionStatement();

  const fileData = loadCoverageData('tests/instrumentation/statements.js');
  t.equal(fileData.statements[0], 2);
  t.equal(fileData.lines[0], 2);
});

test('return statements should be instrumented', (t) => {
  t.plan(3);

  t.equal(stmts.returnStatement(), 'Hello World!');

  const fileData = loadCoverageData('tests/instrumentation/statements.js');
  t.equal(fileData.statements[1], 6);
  t.equal(fileData.lines[1], 6);
});

test('variable declarations should be instrumented', (t) => {
  t.plan(6);

  vars.variableDeclarations();

  const fileData = loadCoverageData('tests/instrumentation/variable-declarations.js');
  t.equal(fileData.statements[0], 2);
  t.equal(fileData.lines[0], 2);
  t.equal(fileData.statements[1], 3);
  t.equal(fileData.lines[1], 3);
  t.equal(fileData.statements[2], 4);
  t.equal(fileData.lines[2], 4);
});
