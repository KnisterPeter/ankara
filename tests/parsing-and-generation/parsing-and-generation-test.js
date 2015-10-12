import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';

import * as classes from './classes';

test('parsing and regenerating classes', (t) => {
  new classes.SimpleClass();
  t.end();
});
