import { StripeBase } from "."
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
      options,
      ["p24"]
    )
  }
}

export default Przelewy24ProviderService
