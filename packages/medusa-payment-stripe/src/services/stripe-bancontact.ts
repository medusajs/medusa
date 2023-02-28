import StripeBase from "../core/stripe-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types"

class BancontactProviderService extends StripeBase {
  static identifier = PaymentProviderKeys.BAN_CONTACT

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
