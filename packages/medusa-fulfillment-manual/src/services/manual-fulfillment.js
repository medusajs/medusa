import { FulfillmentService } from "medusa-interfaces"

class ManualFulfillmentService extends FulfillmentService {
  static identifier = "manual"

  constructor() {
    super()
  }

  getFulfillmentOptions() {
    return [
      {
        id: "manual-fulfillment",
      },
      {
        id: "manual-fulfillment-return",
        is_return: true,
      },
    ]
  }

  validateFulfillmentData(_, data, cart) {
    return data
  }

  validateOption(data) {
    return true
  }

  canCalculate() {
    return false
  }

  calculatePrice() {
    throw Error("Manual Fulfillment service cannot calculatePrice")
  }

  createOrder() {
    // No data is being sent anywhere
    return Promise.resolve({})
  }

  createReturn() {
    // No data is being sent anywhere
    return Promise.resolve({})
  }

  createFulfillment() {
    // No data is being sent anywhere
    return Promise.resolve({})
  }

  cancelFulfillment() {
    return Promise.resolve({})
  }
}

export default ManualFulfillmentService
