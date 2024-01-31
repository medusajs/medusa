import StripeBaseService from "./core/stripe-base"
import StripeBancontactService from "./services/stripe-bancontact"
import StripeBlikService from "./services/stripe-blik"
import StripeGiropayService from "./services/stripe-giropay"
import StripeIdealService from "./services/stripe-ideal"
import StripeProviderService from "./services/stripe-provider"
import StripePrzelewy24Service from "./services/stripe-przelewy24"

export * from "./types"

export default {
  services: [
    StripeBancontactService,
    StripeBaseService,
    StripeBlikService,
    StripeGiropayService,
    StripeIdealService,
    StripePrzelewy24Service,
    StripeProviderService,
  ],
}
