import { FulfillmentService } from "medusa-interfaces"
import Webshipper from "../utils/webshipper"

class WebshipperFulfillmentService extends FulfillmentService {
  static identifier = "webshipper"

  constructor({}, options) {
    super()

    this.options_ = options
    this.client_ = new Webshipper({
      account: options.account,
      token: options.api_token,
    })
  }

  async getFulfillmentOptions() {
    const rates = await this.client_.shippingRates.list()

    return rates.data.map((r) => ({
      id: r.id,
      name: r.attributes.name,
      require_drop_point: r.attributes.require_drop_point,
      carrier_id: r.attributes.carrier_id,
    }))
  }

  validateFulfillmentData(data, cart) {
    // Check if each of the data.service_attributes are filled
  }

  validateOption(data) {
    // shipping-rates/id
  }

  canCalculate() {
    // Return whether or not we are able to calculate dynamically
    return false
  }

  calculatePrice() {
    // Calculate prices
  }

  createOrder() {
    // POST /orders
  }
}

export default WebshipperFulfillmentService
