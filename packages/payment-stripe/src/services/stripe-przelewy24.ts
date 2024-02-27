import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class Przelewy24ProviderService extends StripeBase {
  static PROVIDER = PaymentProviderKeys.PRZELEWY_24

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["p24"],
      capture_method: "automatic",
    }
  }
}

export default Przelewy24ProviderService
