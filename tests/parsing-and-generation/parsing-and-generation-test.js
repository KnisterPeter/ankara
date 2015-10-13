import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';

import * as classes from './classes';

test('parsing and regenerating classes', (t) => {
  let instance = new classes.SimpleClass();
  t.ok(classes.SimpleClass.staticMethod);
  t.ok(instance.method);
  t.end();
});
