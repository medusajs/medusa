import StripeBase from "../helpers/stripe-base"

class GiropayProviderService extends StripeBase {
  static identifier = "stripe-giropay"

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
      payment_method_types: ["giropay"],
      setup_future_usage: "off_session",
    }
  }
}

export default GiropayProviderService
