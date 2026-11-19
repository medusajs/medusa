import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { AdyenProviderService } from "./services"

const services = [AdyenProviderService]

export default ModuleProvider(Modules.PAYMENT, {
  services,
})
