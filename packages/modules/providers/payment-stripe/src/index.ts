import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import {
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
  StripePromptpayService,
  OxxoProviderService,
} from "./services"

// Public so an application can extend a bundled provider instead of importing from dist.
export * from "./services"

const services = [
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
  StripePromptpayService,
  OxxoProviderService,
]

export default ModuleProvider(Modules.PAYMENT, {
  services,
})
