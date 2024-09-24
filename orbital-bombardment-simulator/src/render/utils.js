// utils.js

export class ObjectPool {
  constructor(createFn, resetFn = (obj) => obj) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }

  get() {
    if (this.pool.length === 0) {
      return this.createFn();
    }
    return this.pool.pop();
  }

  release(object) {
    this.resetFn(object);
    this.pool.push(object);
  }
}