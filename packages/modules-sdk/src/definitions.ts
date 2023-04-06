import {
  ModuleDefinition,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/types"

export enum Modules {
  EVENT_BUS = "eventBus",
  STOCK_LOCATION = "stockLocationService",
  INVENTORY = "inventoryService",
  CACHE = "cacheService",
}

export const ModulesDefinition: { [key: string]: ModuleDefinition } = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    registrationName: "eventBusModuleService",
    defaultPackage: "@medusajs/event-bus-local",
    label: "EventBusModuleService",
    canOverride: true,
    isRequired: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STOCK_LOCATION]: {
    key: Modules.STOCK_LOCATION,
    registrationName: "stockLocationService",
    defaultPackage: false,
    label: "StockLocationService",
    isRequired: false,
    canOverride: true,
    dependencies: ["eventBusService"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INVENTORY]: {
    key: Modules.INVENTORY,
    registrationName: "inventoryService",
    defaultPackage: false,
    label: "InventoryService",
    isRequired: false,
    canOverride: true,
    dependencies: ["eventBusService"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CACHE]: {
    key: Modules.CACHE,
    registrationName: "cacheService",
    defaultPackage: "@medusajs/cache-inmemory",
    label: "CacheService",
    isRequired: true,
    canOverride: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
