import _ from "lodash"
import { PaymentService } from "medusa-interfaces"

class StripeProviderService extends PaymentService {
  static identifier = "stripe"

  constructor(appScope, options) {
    super()
    console.log(options)
  }
}

export default StripeProviderService
