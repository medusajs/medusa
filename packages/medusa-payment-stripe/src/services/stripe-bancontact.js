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

  getSupportedIntentOptions() {
    return {
      payment_method_types: ["bancontact"],
      capture_method: "automatic",
    }
  }
}

export default BancontactProviderService
