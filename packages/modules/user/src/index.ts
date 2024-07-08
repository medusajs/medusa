import { UserModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.USER, {
  service: UserModuleService,
})
