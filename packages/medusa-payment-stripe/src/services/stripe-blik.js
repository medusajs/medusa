import StripeBase from "../helpers/stripe-base"

class BlikProviderService extends StripeBase {
  static identifier = "stripe-blik"

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
      payment_method_types: ["blik"],
      setup_future_usage: "off_session",
    }
  }
}

export default BlikProviderService
