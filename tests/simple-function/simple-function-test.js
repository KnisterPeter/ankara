import test from 'tape';
import {join, relative} from 'path';
import {instrument} from '../../';
import {transform} from 'babel';

import * as fns from './functions';

test('exec simple function', (t) => {
  t.plan(4);

  // let code = instrument(join('tests', 'simple-function', 'functions.js'));
  // console.log(code);

  // let mod = {
  //   exports: {}
  // };
  // new Function('module', 'exports', 'require', transform(code).code)(mod, mod.exports, require);

  t.equal(fns.default(), 'Hello world! 3');
  t.equal(fns.test(), 'Hello world!');
  t.equal(fns.withArgs(1, 2), 3);
  t.equal(fns.templates(), 'Hello 1 a 2 world!');
});
