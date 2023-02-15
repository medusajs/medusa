import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions } from "../types"

class BancontactProviderService extends StripeBase {
  static identifier = "stripe-bancontact"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["bancontact"],
      capture_method: "automatic",
    }
  }
}

export default BancontactProviderService
