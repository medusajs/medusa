import { StoreModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.STORE, {
  service: StoreModuleService,
})
