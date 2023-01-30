import {
  ModuleDefinition,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "../../types/global"

export const inventoryModuleDefinition: ModuleDefinition = {
  key: "inventoryService",
  registrationName: "inventoryService",
  defaultPackage: false,
  label: "InventoryService",
  isRequired: false,
  canOverride: true,
  defaultModuleDeclaration: {
    scope: MODULE_SCOPE.INTERNAL,
    resources: MODULE_RESOURCE_TYPE.SHARED,
  },
}

export const stockLocationModuleDefinition: ModuleDefinition = {
  key: "stockLocationService",
  registrationName: "stockLocationService",
  defaultPackage: false,
  label: "StockLocationService",
  isRequired: false,
  canOverride: true,
  defaultModuleDeclaration: {
    scope: MODULE_SCOPE.INTERNAL,
    resources: MODULE_RESOURCE_TYPE.SHARED,
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  stockLocationModuleDefinition,
  inventoryModuleDefinition,
]

export default MODULE_DEFINITIONS
