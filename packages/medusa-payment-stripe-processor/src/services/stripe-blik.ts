import StripeBase from "../helpers/stripe-base"
import { PaymentIntentOptions } from "../types";

class BlikProviderService extends StripeBase {
  static identifier = "stripe-blik"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["blik"],
      capture_method: "automatic",
    }
  }
}

export default BlikProviderService
