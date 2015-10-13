export class SimpleClass {

  constructor() {
  }

  method() {
  }

  static staticMethod() {
  }

}

export class ExtendedClass extends SimpleClass {

  static staticProperty = 0;

  property = 0;

  constructor() {
    super();
  }

}
