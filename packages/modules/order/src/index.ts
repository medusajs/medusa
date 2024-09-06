import { Module, Modules } from "@medusajs/utils"
import { OrderModuleService } from "@services"

export default Module(Modules.ORDER, {
  service: OrderModuleService,
})
