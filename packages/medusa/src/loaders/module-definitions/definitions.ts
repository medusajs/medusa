import {
  ModuleDefinition,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "../../types/global"

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: "eventBus",
    registrationName: "eventBusService",
    defaultPackage: "@medusajs/event-bus-local",
    label: "EventBusService",
    canOverride: true,
    isRequired: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  {
    key: "backgroundJob",
    registrationName: "backgroundJobService",
    defaultPackage: "@medusajs/background-job-local",
    label: "BackgroundJobService",
    canOverride: true,
    isRequired: false,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  {
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
  },
  {
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
  },
]

export default MODULE_DEFINITIONS
