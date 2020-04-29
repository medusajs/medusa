import { FulfillmentService } from "medusa-interfaces"

class ManualFulfillmentService extends FulfillmentService { 
  static identifier = "manual"

  constructor() {
    super()
  }

  getFulfillmentOptions() {
    return [{
      id: "manual-fulfillment"
    }]
  }

  validateFulfillmentData(data, cart) {
    return data
  }

  validateOption(data) {
    if (data.id === "manual-fulfillment") {
      return true
    }

    return false
  }

  canCalculate() {
    return false
  }

  calculatePrice() {
    throw Error("Manual Fulfillment service cannot calculatePrice")
  }

  createOrder() {
    // No data is being sent anywhere
    return
  }
}

export default ManualFulfillmentService
