export function selfCalling(callback) {
  (function() {
    callback();
  })();
}
