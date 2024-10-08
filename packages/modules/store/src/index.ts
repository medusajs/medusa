import { StoreModuleService } from "@services"
import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.STORE, {
  service: StoreModuleService,
})
