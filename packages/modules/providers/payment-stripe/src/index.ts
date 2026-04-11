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
