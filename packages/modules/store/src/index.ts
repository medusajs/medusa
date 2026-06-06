import { StoreModuleService } from "@services"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.STORE, {
  service: StoreModuleService,
})
