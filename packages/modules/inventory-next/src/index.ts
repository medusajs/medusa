import InventoryModuleService from "./services/inventory-module"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.INVENTORY, {
  service: InventoryModuleService,
})
