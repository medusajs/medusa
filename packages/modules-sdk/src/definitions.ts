import {
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
} from "@medusajs/types"

export enum Modules {
  EVENT_BUS = "eventBus",
  STOCK_LOCATION = "stockLocationService",
  INVENTORY = "inventoryService",
  CACHE = "cacheService",
  PRODUCT = "productService",
}

export enum ModuleRegistrationName {
  EVENT_BUS = "eventBusModuleService",
  STOCK_LOCATION = "stockLocationService",
  INVENTORY = "inventoryService",
  CACHE = "cacheService",
  PRODUCT = "productModuleService",
}

export const MODULE_PACKAGE_NAMES = {
  [Modules.PRODUCT]: "@medusajs/product",
  [Modules.EVENT_BUS]: "@medusajs/event-bus-local",
  [Modules.STOCK_LOCATION]: "@medusajs/stock-location",
  [Modules.INVENTORY]: "@medusajs/inventory",
  [Modules.CACHE]: "@medusajs/cache-inmemory",
}

export const ModulesDefinition: { [key: string | Modules]: ModuleDefinition } =
  {
    [Modules.EVENT_BUS]: {
      key: Modules.EVENT_BUS,
      registrationName: ModuleRegistrationName.EVENT_BUS,
      defaultPackage: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
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
      registrationName: ModuleRegistrationName.STOCK_LOCATION,
      defaultPackage: false,
      label: "StockLocationService",
      isRequired: false,
      canOverride: true,
      isQueryable: true,
      dependencies: ["eventBusService"],
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
    [Modules.INVENTORY]: {
      key: Modules.INVENTORY,
      registrationName: ModuleRegistrationName.INVENTORY,
      defaultPackage: false,
      label: "InventoryService",
      isRequired: false,
      canOverride: true,
      isQueryable: true,
      dependencies: ["eventBusService"],
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
    [Modules.CACHE]: {
      key: Modules.CACHE,
      registrationName: ModuleRegistrationName.CACHE,
      defaultPackage: MODULE_PACKAGE_NAMES[Modules.CACHE],
      label: "CacheService",
      isRequired: true,
      canOverride: true,
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
    [Modules.PRODUCT]: {
      key: Modules.PRODUCT,
      registrationName: ModuleRegistrationName.PRODUCT,
      defaultPackage: false,
      label: "ProductModuleService",
      isRequired: false,
      canOverride: true,
      isQueryable: true,
      dependencies: [ModuleRegistrationName.EVENT_BUS, "logger"],
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
  }

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
