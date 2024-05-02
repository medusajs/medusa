class TestFulService {
  static identifier = "test-ful"

  constructor() {
  }

  getFulfillmentOptions() {
    return [
      {
        id: "manual-fulfillment",
      },
    ]
  }

  validateFulfillmentData(data, cart) {
    return data
  }

  validateOption(data) {
    return true
  }

  canCalculate() {
    return true
  }

  calculatePrice(data) {
    return data.price
  }

  createOrder() {
    // No data is being sent anywhere
    return Promise.resolve({})
  }

  createReturn() {
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

export default TestFulService
