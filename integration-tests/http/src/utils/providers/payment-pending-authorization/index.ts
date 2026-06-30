import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { PendingAuthorizationPaymentProvider } from "./provider"

const services = [PendingAuthorizationPaymentProvider]

export default ModuleProvider(Modules.PAYMENT, {
  services,
})
