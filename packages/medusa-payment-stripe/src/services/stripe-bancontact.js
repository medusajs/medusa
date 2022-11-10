import StripeBase from "../helpers/stripe-base"

class BancontactProviderService extends StripeBase {
  static identifier = "stripe-bancontact"

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
      payment_method_types: ["bancontact"],
      setup_future_usage: "off_session",
    }
  }
}

export default BancontactProviderService
