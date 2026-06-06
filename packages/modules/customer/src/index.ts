import { CustomerModuleService } from "@services"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.CUSTOMER, {
  service: CustomerModuleService,
})
