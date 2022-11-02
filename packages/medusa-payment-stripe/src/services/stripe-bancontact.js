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
      options,
      ["bancontact"]
    )
  }
}

export default BancontactProviderService
