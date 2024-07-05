import { OrderModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.ORDER, {
  service: OrderModuleService,
})
