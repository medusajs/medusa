import StripeBase from "../helpers/stripe-base"

class IdealProviderService extends StripeBase {
  static identifier = "stripe-ideal"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions() {
    return {
      payment_method_types: ["ideal"],
      capture_method: "automatic",
    }
  }
}

export default IdealProviderService
