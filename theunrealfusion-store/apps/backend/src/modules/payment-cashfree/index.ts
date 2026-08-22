import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import CashfreePaymentProviderService from "./services/cashfree-provider"

export default ModuleProvider(Modules.PAYMENT, {
  services: [CashfreePaymentProviderService],
})
