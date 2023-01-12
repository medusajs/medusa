import { ModuleDefinition } from "../../types/global"

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: "stockLocationService",
    registrationName: "stockLocationService",
    defaultPackage: false,
    label: "StockLocationService",
    isRequired: false,
    canOverride: true,
  },
  {
    key: "inventoryService",
    registrationName: "inventoryService",
    defaultPackage: false,
    label: "InventoryService",
    isRequired: false,
    canOverride: true,
  },
]

export default MODULE_DEFINITIONS
