import StripeBase from "../helpers/stripe-base"

class Przelewy24ProviderService extends StripeBase {
  static identifier = "stripe-przelewy24"

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
      payment_method_types: ["p24"],
      setup_future_usage: "off_session",
    }
  }
}

export default Przelewy24ProviderService
