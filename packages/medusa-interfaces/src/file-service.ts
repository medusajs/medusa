import BaseService from "./base-service"

/**
 * Interface for file connectors
 * @interface
 */
class BaseFileService extends BaseService {
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
