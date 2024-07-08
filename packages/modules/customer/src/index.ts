import { CustomerModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.CUSTOMER, {
  service: CustomerModuleService,
})
