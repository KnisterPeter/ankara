import {join} from 'path';
import {readFileSync, existsSync} from 'fs';

export function loadCoverageData(file) {
  const dataPath = join(process.cwd(), 'coverage', 'data.json');
  let coverageData;
  if (existsSync(dataPath)) {
    coverageData = JSON.parse(readFileSync(dataPath).toString());
  } else {
    coverageData = {};
  }
  return coverageData[Object.keys(coverageData).find(key => key === file)] || {};
}

export function containsLine(lines, line) {
  return lines && lines.indexOf(line) > -1 || false;
}
