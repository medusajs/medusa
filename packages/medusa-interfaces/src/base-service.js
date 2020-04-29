/**
 * Common functionality for Services
 * @interface
 */
class BaseService {
  constructor() {
    this.decorators_ = []
  }

  /**
   * Adds a decorator to a service. The decorator must be a function and should
   * return a decorated object.
   * @param {function} fn - the decorator to add to the service
   */
  addDecorator(fn) {
    if (typeof fn !== "function") {
      throw Error("Decorators must be of type function")
    }

    this.decorators_.push(fn)
  }

  /**
   * Runs the decorators registered on the service. The decorators are run in
   * the order they have been registered in. Failing decorators will be skipped
   * in order to ensure deliverability in spite of breaking code.
   * @param {object} obj - the object to decorate.
   * @return {object} the decorated object.
   */
  runDecorators_(obj) {
    return this.decorators_.reduce(async (acc, next) => {
      return acc.then(res => next(res)).catch(() => acc)
    }, Promise.resolve(obj))
  }
}
export default BaseService
