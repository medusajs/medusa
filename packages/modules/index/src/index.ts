import { IndexModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.INDEX, {
  service: IndexModuleService,
})
