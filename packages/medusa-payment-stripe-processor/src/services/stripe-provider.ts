import StripeBase from "../helpers/stripe-base";
import { PaymentIntentOptions } from "../types";

class StripeProviderService extends StripeBase {
  static identifier = "stripe"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {}
  }
}

export default StripeProviderService
