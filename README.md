# ankara

[![GitHub license](https://img.shields.io/github/license/KnisterPeter/ankara.svg)](https://github.com/KnisterPeter/ankara)
[![Build Status](https://api.travis-ci.org/KnisterPeter/ankara.svg)](https://travis-ci.org/KnisterPeter/ankara)
[![Dependency Status](https://david-dm.org/KnisterPeter/ankara.svg)](https://david-dm.org/KnisterPeter/ankara)
[![devDependency Status](https://david-dm.org/KnisterPeter/ankara/dev-status.svg)](https://david-dm.org/KnisterPeter/ankara#info=devDependencies)
[![npm version](https://img.shields.io/npm/v/ankara-coverage.svg)](https://www.npmjs.com/package/ankara-coverage)

Code coverage tool leveraging babylon to cover es6/es7 and strawman proposals.

# Usage

## Installation
Install as npm package:

```sh
npm install ankara-coverage --save-dev
```

## Configuration
ankara is reading its configuration from an optional '.ankara.json' file in your project root.
```
{
  "extensions": [
    ".js"
  ],
  "files": [
    "!**/node_modules/**"
  ]
}
```

## Execution
There are two steps required.

First instrumenting your code:
```sh
./node_modules/.bin/ankara-instrument.js
```

Second generating lcov report:
```sh
./node_modules/.bin/ankara-lcov.js
```

The instrumentation step could be done automatically with the provided require hook.
Just import (or require) the register file from ankara.
```js
import 'ankara/dist/register';
```

Note: The register task is compatible with other register tasks but must be required as last step.
This will then replace the previous registered tasks and execute them after instrumentation (e.g. babeljs/register).
