#!/usr/bin/env node

require('babel/register')({
	"stage": 0,
  "optional": [
    "asyncToGenerator"
  ]
});
require('../register');

var glob = require('glob');
var path = require('path');

glob(path.join(__dirname, '**/*-test.js'), function (err, files) {
  files.forEach(function (file) {
    require(path.resolve(process.cwd(), file));
  });
});
