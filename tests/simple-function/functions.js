export default function() {
  var sum = 0;
  var list = [0, 1, 2];
  for (var entry of list) {
    sum += entry;
  }
  console.log(`Hello ${sum} a ${sum} world!`);
  return `Hello world! ${sum}`;
}

export function test() {
  return (0, 'Hello world!');
}

export function withArgs(p1, p2) {
  return p1 + p2;
}

export function templates() {
  var sum = 1;
  return `Hello ${sum} a ${sum + sum} world!`;
}
