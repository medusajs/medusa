import StripeBase from "../helpers/stripe-base"
import { PaymentIntentOptions } from "../types";

class GiropayProviderService extends StripeBase {
  static identifier = "stripe-giropay"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["giropay"],
      capture_method: "automatic",
    }
  }
}

export default GiropayProviderService
