import _ from "lodash"
import PaymentService from "../../../src/interfaces/payment-service"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor(appScope, options) {
    super()
    console.log(options)
  }
}

export default StripeProviderService
