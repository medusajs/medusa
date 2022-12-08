import StripeBase from "../helpers/stripe-base";

class StripeProviderService extends StripeBase {
  static identifier = "stripe"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions() {
    return {}
  }
}

export default StripeProviderService
