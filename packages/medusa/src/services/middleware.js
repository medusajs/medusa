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
   * Validates a middleware function.
   */
  validateMiddleware_(fn) {
    if (typeof fn !== "function") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Middleware must be a function"
      )
    }
  }

  addPostAuthentication(fn, options) {
    this.validateMiddleware_(fn)
    this.postAuthentication_.push({
      middleware,
      options,
    })
  }

  addPreAuthentication(fn, options) {
    this.validateMiddleware_(fn)
    this.preAuthentication_.push({
      middleware,
      options,
    })
  }

  usePostAuthentication(app) {
    for (const object of this.postAuthentication_) {
      app.use(object.middleware(object.options))
    }
  }

  usePreAuthentication(app) {
    for (const object of this.preAuthentication_) {
      app.use(object.middleware(object.options))
    }
  }
}

export default MiddlewareService
