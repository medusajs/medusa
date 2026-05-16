import { Module, Modules } from "@medusajs/framework/utils"
import { StoreInventoryModuleService } from "./services/store-inventory-module-service"

export default Module(Modules.STORE_INVENTORY, {
  service: StoreInventoryModuleService,
})
