import { MedusaError } from "medusa-core-utils"
import { FindOperator, In, Raw } from "typeorm"

/**
 * Common functionality for Services
 * @interface
 */
class BaseService {
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
    const build = (obj) => {
      const where = Object.entries(obj).reduce((acc, [key, value]) => {
        // Undefined values indicate that they have no significance to the query.
        // If the query is looking for rows where a column is not set it should use null instead of undefined
        if (typeof value === "undefined") {
          return acc
        }
        switch (true) {
          case value instanceof FindOperator:
            acc[key] = value
            break
          case Array.isArray(value):
            acc[key] = In([...value])
            break
          case value !== null && typeof value === "object":
            const subquery = []

            Object.entries(value).map(([modifier, val]) => {
              switch (modifier) {
                case "lt":
                  subquery.push({ operator: "<", value: val })
                  break
                case "gt":
                  subquery.push({ operator: ">", value: val })
                  break
                case "lte":
                  subquery.push({ operator: "<=", value: val })
                  break
                case "gte":
                  subquery.push({ operator: ">=", value: val })
                  break
                default:
                  acc[key] = value
                  break
              }
            })

            if (subquery.length) {
              acc[key] = Raw(
                (a) =>
                  subquery
                    .map((s, index) => `${a} ${s.operator} :${index}`)
                    .join(" AND "),
                subquery.map((s) => s.value)
              )
            }
            break
          default:
            acc[key] = value
            break
        }

        return acc
      }, {})

      return where
    }

    const query = {
      where: build(selector),
    }

    if ("deleted_at" in selector) {
      query.withDeleted = true
    }

    if ("skip" in config) {
      query.skip = config.skip
    }

    if ("take" in config) {
      query.take = config.take
    }

    if ("relations" in config) {
      query.relations = config.relations
    }

    if ("select" in config) {
      query.select = config.select
    }

    if ("order" in config) {
      query.order = config.order
    }

    return query
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
  async atomicPhase_(work, isolationOrErrorHandler, maybeErrorHandler) {
    let errorHandler = maybeErrorHandler
    let isolation = isolationOrErrorHandler
    if (typeof isolationOrErrorHandler === "function") {
      isolation = null
      errorHandler = isolationOrErrorHandler
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
        const result = await this.manager_.transaction((m) => doWork(m))
        return result
      } catch (error) {
        if (errorHandler) {
          await errorHandler(error)
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
    const existing = obj.metadata || {}
    const newData = {}
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }
      newData[key] = value
    }

    const updated = {
      ...existing,
      ...newData,
    }

    return updated
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
export default BaseService
