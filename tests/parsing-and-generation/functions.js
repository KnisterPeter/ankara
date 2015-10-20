export function selfCalling(callback) {
  (function() {
    callback();
  })();
}

export function defaultParams(a = 1, b = 2) {
  return a + b;
}
