import test from 'tape';

import * as path from 'path';
import * as fs from 'fs';

import {SimpleClass} from './classes';
import {asyncFunction} from './async-functions';

test('parsing and regenerating classes', (t) => {
  let instance = new SimpleClass();
  t.ok(SimpleClass.staticMethod);
  t.ok(instance.method);
  t.end();
});

test('parsing and generation of async functions', (t) => {
  asyncFunction().then(() => t.end());
});
