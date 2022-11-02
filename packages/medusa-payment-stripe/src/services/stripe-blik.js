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
      options,
      ["blik"]
    )
  }
}

export default BlikProviderService
