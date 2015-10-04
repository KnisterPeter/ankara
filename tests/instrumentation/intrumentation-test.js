import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';
import {loadCoverageData} from '../helper';
import * as stmts from './statements';

test('simple expression statements should be instrumented', (t) => {
  t.plan(4);

  stmts.expressionStatement();

  const fileData = loadCoverageData('tests/instrumentation/statements.js');

  t.equal(fileData.statements.length, 1);
  t.equal(fileData.statements[0], 2);
  t.equal(fileData.lines.length, 1);
  t.equal(fileData.lines[0], 2);
});
