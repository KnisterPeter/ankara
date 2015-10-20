export function newlines() {
  return '\r\n\t\\n';
}

export function extendedObjectLiterals() {
  let a = 'a';
  return {
    a,
    [(() => 'b')()]: 'b',
    test() {
      return 'test';
    }
  };
}
