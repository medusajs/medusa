import { ModuleDefinition } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  upperCaseFirst,
} from "@medusajs/utils"
import { MODULE_RESOURCE_TYPE, MODULE_SCOPE } from "./types"

export const MODULE_PACKAGE_NAMES = {
  [Modules.AUTH]: "@medusajs/medusa/modules/auth",
  [Modules.CACHE]: "@medusajs/medusa/modules/cache-inmemory",
  [Modules.CART]: "@medusajs/medusa/modules/cart",
  [Modules.CUSTOMER]: "@medusajs/medusa/modules/customer",
  [Modules.EVENT_BUS]: "@medusajs/medusa/modules/event-bus-local",
  [Modules.INVENTORY]: "@medusajs/medusa/modules/inventory-next", // TODO: To be replaced when current `@medusajs/inventory` is deprecated
  [Modules.LINK]: "@medusajs/medusa/modules/link-modules",
  [Modules.PAYMENT]: "@medusajs/medusa/modules/payment",
  [Modules.PRICING]: "@medusajs/medusa/modules/pricing",
  [Modules.PRODUCT]: "@medusajs/medusa/modules/product",
  [Modules.PROMOTION]: "@medusajs/medusa/modules/promotion",
  [Modules.SALES_CHANNEL]: "@medusajs/medusa/modules/sales-channel",
  [Modules.FULFILLMENT]: "@medusajs/medusa/modules/fulfillment",
  [Modules.STOCK_LOCATION]: "@medusajs/medusa/modules/stock-location-next", // TODO: To be replaced when current `@medusajs/stock-location` is deprecated
  [Modules.TAX]: "@medusajs/medusa/modules/tax",
  [Modules.USER]: "@medusajs/medusa/modules/user",
  [Modules.WORKFLOW_ENGINE]:
    "@medusajs/medusa/modules/workflow-engine-inmemory",
  [Modules.REGION]: "@medusajs/medusa/modules/region",
  [Modules.ORDER]: "@medusajs/medusa/modules/order",
  [Modules.API_KEY]: "@medusajs/medusa/modules/api-key",
  [Modules.STORE]: "@medusajs/medusa/modules/store",
  [Modules.CURRENCY]: "@medusajs/medusa/modules/currency",
  [Modules.FILE]: "@medusajs/medusa/modules/file",
  [Modules.NOTIFICATION]: "@medusajs/medusa/modules/notification",
  [Modules.INDEX]: "@medusajs/medusa/modules/index-module",
}

export const ModulesDefinition: {
  [key: string]: ModuleDefinition
} = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
    label: upperCaseFirst(Modules.EVENT_BUS),
    isRequired: true,
    isQueryable: false,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STOCK_LOCATION]: {
    key: Modules.STOCK_LOCATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.STOCK_LOCATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INVENTORY]: {
    key: Modules.INVENTORY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.INVENTORY),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CACHE]: {
    key: Modules.CACHE,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.CACHE],
    label: upperCaseFirst(Modules.CACHE),
    isRequired: true,
    isQueryable: false,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PRODUCT]: {
    key: Modules.PRODUCT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRODUCT),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PRICING]: {
    key: Modules.PRICING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRICING),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PROMOTION]: {
    key: Modules.PROMOTION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PROMOTION),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.AUTH]: {
    key: Modules.AUTH,
    defaultPackage: false,
    label: upperCaseFirst(Modules.AUTH),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.WORKFLOW_ENGINE]: {
    key: Modules.WORKFLOW_ENGINE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.WORKFLOW_ENGINE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    __passSharedContainer: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.SALES_CHANNEL]: {
    key: Modules.SALES_CHANNEL,
    defaultPackage: false,
    label: upperCaseFirst(Modules.SALES_CHANNEL),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.FULFILLMENT]: {
    key: Modules.FULFILLMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FULFILLMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CART]: {
    key: Modules.CART,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CART),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CUSTOMER]: {
    key: Modules.CUSTOMER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CUSTOMER),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.PAYMENT]: {
    key: Modules.PAYMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PAYMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.USER]: {
    key: Modules.USER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.USER),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.REGION]: {
    key: Modules.REGION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.REGION),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.ORDER]: {
    key: Modules.ORDER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.ORDER),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.TAX]: {
    key: Modules.TAX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.TAX),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger", Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.API_KEY]: {
    key: Modules.API_KEY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.API_KEY),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.STORE]: {
    key: Modules.STORE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.STORE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.CURRENCY]: {
    key: Modules.CURRENCY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CURRENCY),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.FILE]: {
    key: Modules.FILE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FILE),
    isRequired: false,
    isQueryable: true,
    dependencies: ["logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.NOTIFICATION]: {
    key: Modules.NOTIFICATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.NOTIFICATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, "logger"],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
  [Modules.INDEX]: {
    key: Modules.INDEX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.INDEX),
    isRequired: false,
    isQueryable: false,
    dependencies: [
      Modules.EVENT_BUS,
      "logger",
      ContainerRegistrationKeys.REMOTE_QUERY,
      ContainerRegistrationKeys.QUERY,
    ],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.SHARED,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
