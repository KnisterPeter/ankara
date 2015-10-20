export function arraySpread() {
  let a = [0, 1, 2];
  let b = ['a', 'b', 'c'];
  return [...a, ...b];
}

export function destructuredArray() {
  let array = ['a', 'b', 'c'];
  let [,,c] = array;
  return c;
}


export function restParameter(a, b, ...rest) {
  return rest;
}

export function spreadParameter() {
  let f = (a, b, c) => a + b + c;
  return f(...[0, 1, 2]);
}

export function objectSpread() {
  let a = {
    key1: 'value1',
    key2: 'value2'
  };
  let b = {
    key2: 'value3'
  };
  return {
    ...a,
    ...b
  };
}
