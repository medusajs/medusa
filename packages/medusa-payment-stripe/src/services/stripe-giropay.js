import { StripeBase } from "."

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
      options,
      ["giropay"]
    )
  }
}

export default GiropayProviderService
