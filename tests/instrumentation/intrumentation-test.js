import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';
import * as stmts from './statements';

test('simple expression statements should be instrumented', (t) => {
  t.plan(5);
  stmts.expressionStatement(arg => {
    t.equal(arg, 'Hello World!');

    const dataPath = path.join(process.cwd(), 'coverage', 'data.json');
    const coverageData = JSON.parse(fs.readFileSync(dataPath).toString());
    const fileData = coverageData['tests/instrumentation/statements.js'];
    t.equal(fileData.statements.length, 1);
    t.equal(fileData.statements[0], 2);
    t.equal(fileData.lines.length, 1);
    t.equal(fileData.lines[0], 2);
  });
});
