import { CustomerModuleService } from "@services"
import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.CUSTOMER, {
  service: CustomerModuleService,
})
