import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class GiropayProviderService extends StripeBase {
  static identifier = PaymentProviderKeys.GIROPAY

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
