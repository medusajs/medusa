import { ModuleProviderExports } from "@medusajs/types"
import { ManualFulfillmentService } from "./services/manual-fulfillment"

const services = [ManualFulfillmentService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
