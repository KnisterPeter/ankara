import test from 'tape';
import {join, relative} from 'path';
import {instrument} from '../../';
import {transform} from 'babel';

test('exec simple function', (t) => {
  t.plan(4);

  let code = instrument(join('tests', 'simple-function', 'functions.js'));
  console.log(code);

  let mod = {
    exports: {}
  };
  new Function('module', 'exports', 'require', transform(code).code)(mod, mod.exports, require);

  t.equal(mod.exports.default(), 'Hello world! 3');
  t.equal(mod.exports.test(), 'Hello world!');
  t.equal(mod.exports.withArgs(1, 2), 3);
  t.equal(mod.exports.templates(), 'Hello 1 a 2 world!');
});
