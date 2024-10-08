import { UserModuleService } from "@services"
import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.USER, {
  service: UserModuleService,
})
