import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { EasyPostFulfillmentService } from "./services/easypost-fulfillment"

const services = [EasyPostFulfillmentService]

export default ModuleProvider(Modules.FULFILLMENT, {
  services,
})
