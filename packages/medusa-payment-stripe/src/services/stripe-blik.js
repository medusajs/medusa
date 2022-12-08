import StripeBase from "../helpers/stripe-base"

class BlikProviderService extends StripeBase {
  static identifier = "stripe-blik"

  constructor({ stripeProviderService, manager }, options) {
    super({ stripeProviderService, manager }, options)
  }

  get paymentIntentOptions() {
    return {
      payment_method_types: ["blik"],
      capture_method: "automatic",
    }
  }
}

export default BlikProviderService
