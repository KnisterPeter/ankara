import {join} from 'path';
import {readFileSync} from 'fs';

export function loadCoverageData(file) {
  const dataPath = join(process.cwd(), 'coverage', 'data.json');
  const coverageData = JSON.parse(readFileSync(dataPath).toString());
  return coverageData[Object.keys(coverageData).find(key => key === file)];
}

export function containsLine(lines, line) {
  return lines.indexOf(line) > -1;
}
