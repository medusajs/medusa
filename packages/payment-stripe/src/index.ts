import { ModuleProviderExports } from "@medusajs/types"
import {
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
} from "./services/index"

const services = [
  StripeBancontactService,
  StripeBlikService,
  StripeGiropayService,
  StripeIdealService,
  StripeProviderService,
  StripePrzelewy24Service,
]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
