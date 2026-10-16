import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { EasyPostFulfillmentService } from "./services/easypost-fulfillment"

const services = [EasyPostFulfillmentService]

export default ModuleProvider(Modules.FULFILLMENT, {
  services,
})

// Re-exported so callers outside this provider (e.g. the EasyPost tracking
// webhook route in the consuming app) can reuse this package's own tested
// HMAC webhook-signature verification instead of re-implementing it.
export { EasyPostClient } from "./core/easypost-client"
export type {
  EasyPostClientOptions,
  EasyPostShipment,
} from "./core/easypost-client"
