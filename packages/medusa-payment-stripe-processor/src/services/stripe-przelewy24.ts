import StripeBase from "../helpers/stripe-base"

class Przelewy24ProviderService extends StripeBase {
  static identifier = "stripe-przelewy24"

  constructor(_, options) {
    super(_, options)
  }

  get paymentIntentOptions() {
    return {
      payment_method_types: ["p24"],
      capture_method: "automatic",
    }
  }
}

export default Przelewy24ProviderService
