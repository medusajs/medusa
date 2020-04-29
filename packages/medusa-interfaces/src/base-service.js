/**
 * Common functionality for Services
 * @interface
 */
class BaseService {
  constructor() {
    this.decorators_ = []
  }

  addDecorator(fn) {
    if (typeof fn !== "function") {
      throw Error("Decorators must be of type function")
    }

    this.decorators_.push(fn)
  }

  runDecorators_(obj) {
    return this.decorators_.reduce(async (acc, next) => {
      return acc.then(res => next(res)).catch(() => acc)
    }, Promise.resolve(obj))
  }
}
export default BaseService
