import test from 'tape';

import * as fns from './functions';

test('exec simple function', (t) => {
  t.plan(4);

  t.equal(fns.default(), 'Hello world! 3');
  t.equal(fns.test(), 'Hello world!');
  t.equal(fns.withArgs(1, 2), 3);
  t.equal(fns.templates(), 'Hello 1 a 2 world!');
});
