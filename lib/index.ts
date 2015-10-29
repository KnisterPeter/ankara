/// <reference path="../typings/references.d.ts" />
import 'source-map-support/register';
import {join, relative, dirname, basename} from 'path';
import {sync as mkdirp} from 'mkdirp';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import rc from 'rc';
import {CoverageData, FileCoverageData} from './cover';
import {parse, parseFragment} from './parser';
import * as types from './types';

let devCover = join(__dirname, 'cover.js');
let devMode = existsSync(devCover);

const config = rc('ankara', {
  extensions: ['.js']
});

/**
 * @param entryPoint - The file to start instrumenting with
 * @param cover - True if this file should be covered, false to only collect next files
 * @returns An array of next files to instrument
 */
export function instrumentFiles(entryPoint: string, cover: boolean): string[] {
  let next: string[] = [];
  const relativeFile = relative(process.cwd(), entryPoint);
  let ast = parse(relativeFile);
  ast.visit(node => {
    if (node instanceof types.ImportDeclaration) {
      let dependency = (node.source as types.Literal).value as string;
      if (dependency.charAt(0) == '.') {
        if (basename(dependency).lastIndexOf('.') == -1) {
          // TODO: Check which extension is the correct one (assuming index 0 is not enough)
          dependency = dependency + config.extensions[0];
        }
        next.push(join(dirname(relativeFile), dependency));
      }
    }
  });
  if (cover) {
    instrumentFile(relativeFile);
  }
  return next;
}

export function instrumentFile(file: string): string {
  //console.log(`-- ${file} -------------------------------`);
  const instr = instrument(file);
  // console.log(instr);
  //console.log('---------------------------------');
  const instrumentedFile = join(process.cwd(), 'coverage', relative(process.cwd(), file));
  mkdirp(dirname(instrumentedFile));
  writeFileSync(instrumentedFile, instr);
  return instrumentedFile;
}

export function instrument(file: string): string {
  const relativeFile = relative(process.cwd(), file);
  let ast = parse(file);
  let statements = [];
  ast.visit(node => {
    if (node.instrumented) {
      statements.push(node.loc.start.line);
    }
  });
  ast.visit(node => {
    if (node instanceof types.Program) {
      let coverLib = devMode ? devCover : 'ankara/dist/cover';
      let fragment = parseFragment(`
        import {cover as __$c} from '${coverLib}';
        __$c.init("${relativeFile}", [${statements}]);
      `);
      node.body[0].insertBefore(fragment);
    } else if (node.instrumented) {
      node.instrument(relativeFile);
    }
  });
  return ast.toJavaScript();
}

export function generateLcov() {
  const dirname = join(process.cwd(), 'coverage');
  const data = <CoverageData>JSON.parse(readFileSync(join(dirname, 'data.json')).toString());
  let lcov = 'TN:\n';
  Object.keys(data).forEach(file => {
    lcov += `SF: ${join(process.cwd(), file)}\n`;
    const fileData = data[file];
    lcov += fileData.lines
      .sort((a, b) => a - b)
      .map(line => `DA:${line},1\n`)
      .join('');
    lcov += `LF:${fileData.statements.length}\n`;
    lcov += `LH:${fileData.lines.length}\n`;
    lcov += 'end_of_record\n';
  });
  writeFileSync(join(dirname, 'lcov.info'), lcov);
}
