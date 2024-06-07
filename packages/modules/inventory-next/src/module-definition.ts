import { ModuleExports } from "@medusajs/types"
import InventoryService from "./services/inventory-module"

const service = InventoryService

export const moduleDefinition: ModuleExports = {
  service,
}
