import stripeModuleProvider, * as stripePackage from "../index"
import * as services from "../services"

describe("@medusajs/payment-stripe entry point", () => {
  it("exports every provider class it registers, so they can be extended", () => {
    const exportNames = [
      "StripeBancontactService",
      "StripeBlikService",
      "StripeGiropayService",
      "StripeIdealService",
      "StripeProviderService",
      "StripePrzelewy24Service",
      "StripePromptpayService",
      "OxxoProviderService",
    ]

    for (const name of exportNames) {
      expect(stripePackage[name]).toBe(services[name])
    }
    expect(stripeModuleProvider.services).toEqual(
      exportNames.map((name) => stripePackage[name])
    )
  })
})
