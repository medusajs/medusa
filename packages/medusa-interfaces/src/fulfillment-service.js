import BaseService from "./base-service"

/**
 * The interface that all fulfillment services must inherit from. The intercace
 * provides the necessary methods for creating, authorizing and managing
 * fulfillment orders.
 * @interface
 */
class BaseFulfillmentService extends BaseService {
  constructor() {
    super()
  }

  getFulfillmentOptions() {
  }

  validateFulfillmentData(data, cart) {
    throw Error("validateFulfillmentData must be overridden by the child class")
  }

  validateOption(data) {
    throw Error("validateOption must be overridden by the child class")
  }

  canCalculate(data) {
    throw Error("canCalculate must be overridden by the child class")
  }

  calculatePrice(data) {
    throw Error("calculatePrice must be overridden by the child class")
  }

  createOrder() {
    throw Error("createOrder must be overridden by the child class")
  }
}

export default BaseFulfillmentService
