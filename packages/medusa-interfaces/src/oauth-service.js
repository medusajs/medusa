import BaseService from "./base-service"

/**
 * Interface for file connectors
 * @interface
 */
class BaseOauthService extends BaseService {
  static _isOauthService = true

  static isOauthService(obj) {
    return obj?.constructor?._isOauthService
  }

  constructor() {
    super()
  }

  generateToken() {
    throw Error("generateToken must be overridden by the child class")
  }

  refreshToken() {
    throw Error("refreshToken must be overridden by the child class")
  }

  destroyToken() {
    throw Error("destroyToken must be overridden by the child class")
  }
}

export default BaseOauthService
