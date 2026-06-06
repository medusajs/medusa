import InventoryModuleService from "./services/inventory-module"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.INVENTORY, {
  service: InventoryModuleService,
})
