// Import from dist to avoid circular deps which result in the base service to be undefined
import { buildQuery, setMetadata, validateId } from "@medusajs/medusa/dist/utils"

/**
 * Common functionality for Services
 * @interface
 * @deprecated use TransactionBaseService from @medusajs/medusa instead
 */
export default class BaseService {
  constructor() {
    this.decorators_ = []
  }

  withTransaction() {
    console.log("WARN: withTransaction called without custom implementation")
    return this
  }

  /**
   * Used to build TypeORM queries.
   */
  buildQuery_(selector, config = {}) {
    return buildQuery(selector, config)
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
    return validateId(rawId, config)
  }

  shouldRetryTransaction(err) {
    const code = typeof err === "object" ? String(err.code) : null
    return code === "40001" || code === "40P01"
  }

  /**
   * Wraps some work within a transactional block. If the service already has
   * a transaction manager attached this will be reused, otherwise a new
   * transaction manager is created.
   * @param {function} work - the transactional work to be done
   * @param {string} isolation - the isolation level to be used for the work.
   * @return {any} the result of the transactional work
   */
  async atomicPhase_(
    work,
    isolationOrErrorHandler,
    maybeErrorHandlerOrDontFail
  ) {
    let errorHandler = maybeErrorHandlerOrDontFail
    let isolation = isolationOrErrorHandler
    let dontFail = false
    if (typeof isolationOrErrorHandler === "function") {
      isolation = null
      errorHandler = isolationOrErrorHandler
      dontFail = !!maybeErrorHandlerOrDontFail
    }

    if (this.transactionManager_) {
      const doWork = async (m) => {
        this.manager_ = m
        this.transactionManager_ = m
        try {
          const result = await work(m)
          return result
        } catch (error) {
          if (errorHandler) {
            const queryRunner = this.transactionManager_.queryRunner
            if (queryRunner.isTransactionActive) {
              await queryRunner.rollbackTransaction()
            }

            await errorHandler(error)
          }
          throw error
        }
      }

      return doWork(this.transactionManager_)
    } else {
      const temp = this.manager_
      const doWork = async (m) => {
        this.manager_ = m
        this.transactionManager_ = m
        try {
          const result = await work(m)
          this.manager_ = temp
          this.transactionManager_ = undefined
          return result
        } catch (error) {
          this.manager_ = temp
          this.transactionManager_ = undefined
          throw error
        }
      }

      if (isolation) {
        let result
        try {
          result = await this.manager_.transaction(isolation, (m) => doWork(m))
          return result
        } catch (error) {
          if (this.shouldRetryTransaction(error)) {
            return this.manager_.transaction(isolation, (m) => doWork(m))
          } else {
            if (errorHandler) {
              await errorHandler(error)
            }
            throw error
          }
        }
      }

      try {
        return await this.manager_.transaction((m) => doWork(m))
      } catch (error) {
        if (errorHandler) {
          const result = await errorHandler(error)
          if (dontFail) {
            return result
          }
        }

        throw error
      }
    }
  }

  /**
   * Dedicated method to set metadata.
   * @param {string} obj - the entity to apply metadata to.
   * @param {object} metadata - the metadata to set
   * @return {Promise} resolves to the updated result.
   */
  setMetadata_(obj, metadata) {
    return setMetadata(obj, metadata)
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
      return acc.then((res) => next(res, fields, expandFields)).catch(() => acc)
    }, Promise.resolve(obj))
  }
}
