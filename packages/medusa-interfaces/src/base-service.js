import { MedusaError } from "medusa-core-utils"
/**
 * Common functionality for Services
 * @interface
 */
class BaseService {
  constructor() {
    this.decorators_ = []
  }

  /**
   * Confirms whether a given raw id is valid. Fails if the provided
   * id is null or undefined. The validate function takes an optional config
   * param, to support checking id prefix and length.
   * @param {string} rawId - the id to validate.
   * @param {object?} config - optional config
   * @returns {string} the rawId given that nothing failed
   */
  validateId_(rawId, config = {}) {
    const { prefix, length } = config
    if (!rawId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to validate id: ${rawId}`
      )
    }

    if (prefix || length) {
      const [pre, rand] = rawId.split("_")
      if (prefix && pre !== prefix) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The provided id: ${rawId} does not adhere to prefix constraint: ${prefix}`
        )
      }

      if (length && length !== rand.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The provided id: ${rawId} does not adhere to length constraint: ${length}`
        )
      }
    }

    return rawId
  }

  /**
   * Wraps some work within a transactional block. If the service already has
   * a transaction manager attached this will be reused, otherwise a new
   * transaction manager is created.
   * @param {function} work - the transactional work to be done
   * @param {string} isolation - the isolation level to be used for the work.
   * @return {any} the result of the transactional work
   */
  atomicPhase_(work, isolation) {
    if (this.transactionManager_) {
      return work(this.transactionManager_)
    } else {
      const temp = this.manager_
      const doWork = async m => {
        this.manager_ = m
        this.transactionManager_ = m
        const result = await work(m)
        this.manager = temp
        this.transactionManager_ = undefined
        return result
      }

      if (isolation) {
        return this.manager_.transaction(isolation, m => doWork(m))
      }
      return this.manager_.transaction(m => doWork(m))
    }
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
  runDecorators_(obj, fields = [], expandFields = []) {
    return this.decorators_.reduce(async (acc, next) => {
      return acc.then(res => next(res, fields, expandFields)).catch(() => acc)
    }, Promise.resolve(obj))
  }
}
export default BaseService
