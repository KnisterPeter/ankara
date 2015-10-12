#!/usr/bin/env node
var argv = process.argv.slice(2);
argv.unshift('instrument');
require('../dist/cli')(argv);
