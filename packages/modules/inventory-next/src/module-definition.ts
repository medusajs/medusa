import InventoryService from "./services/inventory"
import { ModuleExports } from "@medusajs/types"

const service = InventoryService

export const moduleDefinition: ModuleExports = {
  service,
}
