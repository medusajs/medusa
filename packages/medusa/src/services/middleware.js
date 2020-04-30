import { MedusaError } from "medusa-core-utils"

/**
 * Orchestrates dynamic middleware registered through the Medusa Middleware API
 */
class MiddlewareService {
  constructor(container) {
    this.postAuthentication_ = []
    this.preAuthentication_ = []
  }

  /**
   * Validates a middleware function, throws if fn is not of type function.
   * @param {function} fn - the middleware function to validate.
   */
  validateMiddleware_(fn) {
    if (typeof fn !== "function") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Middleware must be a function"
      )
    }
  }

  /**
   * Adds a middleware function to be called after authentication is completed.
   * @param {function} middleware - the middleware function. Should return a
   *   middleware function.
   * @param {object} options - the arguments that will be passed to the
   *   middleware
   * @return {void}
   */
  addPostAuthentication(middleware, options) {
    this.validateMiddleware_(middleware)
    this.postAuthentication_.push({
      middleware,
      options: options || {},
    })
  }

  /**
   * Adds a middleware function to be called before authentication is completed.
   * @param {function} middleware - the middleware function. Should return a
   *   middleware function.
   * @param {object} options - the arguments that will be passed to the
   *   middleware
   * @return {void}
   */
  addPreAuthentication(middleware, options) {
    this.validateMiddleware_(middleware)
    this.preAuthentication_.push({
      middleware,
      options: options || {},
    })
  }

  /**
   * Adds post authentication middleware to an express app.
   * @param {ExpressApp} app - the express app to add the middleware to
   * @return {void}
   */
  usePostAuthentication(app) {
    for (const object of this.postAuthentication_) {
      app.use(object.middleware(object.options))
    }
  }

  /**
   * Adds pre authentication middleware to an express app.
   * @param {ExpressApp} app - the express app to add the middleware to
   * @return {void}
   */
  usePreAuthentication(app) {
    for (const object of this.preAuthentication_) {
      app.use(object.middleware(object.options))
    }
  }
}

export default MiddlewareService
