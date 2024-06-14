import { ModuleExports } from "@medusajs/types"
import InventoryService from "./services/inventory-module"

const moduleDefinition: ModuleExports = {
  service: InventoryService,
}
export default moduleDefinition
