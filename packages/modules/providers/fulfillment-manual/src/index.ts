import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { ManualFulfillmentService } from "./services/manual-fulfillment"

const services = [ManualFulfillmentService]

export default ModuleProvider(Modules.FULFILLMENT, {
  services,
})
