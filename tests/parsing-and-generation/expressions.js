export function assignment(a, b) {
  let c;
  return a && (c = b);
}

export function logical(a, b, c, d) {
  return a && (b || c) && d;
}
