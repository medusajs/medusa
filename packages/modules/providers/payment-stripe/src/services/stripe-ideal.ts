import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class IdealProviderService extends StripeBase {
  static PROVIDER = PaymentProviderKeys.IDEAL

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["ideal"],
      capture_method: "automatic",
    }
  }
}

export default IdealProviderService
