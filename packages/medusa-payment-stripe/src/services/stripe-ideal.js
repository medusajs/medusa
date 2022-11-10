import StripeBase from "../helpers/stripe-base"

class IdealProviderService extends StripeBase {
  static identifier = "stripe-ideal"

  constructor(
    {
      stripeProviderService,
      customerService,
      totalsService,
      regionService,
      manager,
    },
    options
  ) {
    super(
      {
        stripeProviderService,
        customerService,
        totalsService,
        regionService,
        manager,
      },
      options
    )
  }

  get paymentIntentOptions() {
    return {
      payment_method_types: ["ideal"],
      setup_future_usage: "off_session",
    }
  }
}

export default IdealProviderService
