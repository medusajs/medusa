import { ModuleDefinition } from "../../types/global"

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: "stockLocationService",
    registrationName: "stockLocationService",
    defaultPackage: "@medusajs/stock-locations",
    label: "StockLocationService",
    isRequired: false,
    canOverride: true,
  },
  {
    key: "inventoryService",
    registrationName: "inventoryService",
    defaultPackage: "@medusajs/inventory",
    label: "InventoryService",
    isRequired: false,
    canOverride: true,
  },
]

export default MODULE_DEFINITIONS
