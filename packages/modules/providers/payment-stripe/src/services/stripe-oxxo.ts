import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class OxxoProviderService extends StripeBase {
  static identifier = PaymentProviderKeys.OXXO

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["oxxo"],
      capture_method: "automatic",
      payment_method_options: {
        oxxo: {
          expires_after_days: this.options.oxxoExpiresDays || 3,
        },
      },
    }
  }
}

export default OxxoProviderService
