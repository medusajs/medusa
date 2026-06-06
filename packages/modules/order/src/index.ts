import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { OrderModuleService } from "@services"

export default Module(Modules.ORDER, {
  service: OrderModuleService,
})
