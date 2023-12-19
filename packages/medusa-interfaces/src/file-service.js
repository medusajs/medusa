import BaseService from "./base-service"

/**
 * Interface for file connectors
 * @interface
 * @deprecated use AbstractFileService from @medusajs/medusa instead
 */
class BaseFileService extends BaseService {
  static _isFileService = true

  static isFileService(obj) {
    return obj?.constructor?._isFileService
  }

  constructor() {
    super()
  }

  upload() {
    throw Error("upload must be overridden by the child class")
  }

  delete() {
    throw Error("delete must be overridden by the child class")
  }
}

export default BaseFileService
