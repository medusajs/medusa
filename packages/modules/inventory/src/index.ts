import InventoryModuleService from "./services/inventory-module"
import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.INVENTORY, {
  service: InventoryModuleService,
})
