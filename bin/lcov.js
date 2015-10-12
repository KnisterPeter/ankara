#!/usr/bin/env node
var argv = process.argv.slice(2);
argv.unshift('lcov');
require('../dist/cli')(argv);
