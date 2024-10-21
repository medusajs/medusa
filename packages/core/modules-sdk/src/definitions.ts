import { ModuleDefinition } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MODULE_PACKAGE_NAMES,
  Modules,
  upperCaseFirst,
} from "@medusajs/utils"
import { MODULE_SCOPE } from "./types"

export const ModulesDefinition: {
  [key: string]: ModuleDefinition
} = {
  [Modules.EVENT_BUS]: {
    key: Modules.EVENT_BUS,
    defaultPackage: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
    label: upperCaseFirst(Modules.EVENT_BUS),
    isRequired: true,
    isQueryable: false,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
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
    },
  },
  [Modules.PRODUCT]: {
    key: Modules.PRODUCT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRODUCT),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.PRICING]: {
    key: Modules.PRICING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PRICING),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.PROMOTION]: {
    key: Modules.PROMOTION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PROMOTION),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.AUTH]: {
    key: Modules.AUTH,
    defaultPackage: false,
    label: upperCaseFirst(Modules.AUTH),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.WORKFLOW_ENGINE]: {
    key: Modules.WORKFLOW_ENGINE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.WORKFLOW_ENGINE),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    __passSharedContainer: true,
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.SALES_CHANNEL]: {
    key: Modules.SALES_CHANNEL,
    defaultPackage: false,
    label: upperCaseFirst(Modules.SALES_CHANNEL),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.FULFILLMENT]: {
    key: Modules.FULFILLMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FULFILLMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER, Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.CART]: {
    key: Modules.CART,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CART),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.CUSTOMER]: {
    key: Modules.CUSTOMER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CUSTOMER),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.PAYMENT]: {
    key: Modules.PAYMENT,
    defaultPackage: false,
    label: upperCaseFirst(Modules.PAYMENT),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.USER]: {
    key: Modules.USER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.USER),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.REGION]: {
    key: Modules.REGION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.REGION),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.ORDER]: {
    key: Modules.ORDER,
    defaultPackage: false,
    label: upperCaseFirst(Modules.ORDER),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER, Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.TAX]: {
    key: Modules.TAX,
    defaultPackage: false,
    label: upperCaseFirst(Modules.TAX),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER, Modules.EVENT_BUS],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.API_KEY]: {
    key: Modules.API_KEY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.API_KEY),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.STORE]: {
    key: Modules.STORE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.STORE),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.CURRENCY]: {
    key: Modules.CURRENCY,
    defaultPackage: false,
    label: upperCaseFirst(Modules.CURRENCY),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.FILE]: {
    key: Modules.FILE,
    defaultPackage: false,
    label: upperCaseFirst(Modules.FILE),
    isRequired: false,
    isQueryable: true,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.NOTIFICATION]: {
    key: Modules.NOTIFICATION,
    defaultPackage: false,
    label: upperCaseFirst(Modules.NOTIFICATION),
    isRequired: false,
    isQueryable: true,
    dependencies: [Modules.EVENT_BUS, ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
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
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.REMOTE_QUERY,
      ContainerRegistrationKeys.QUERY,
    ],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
  [Modules.LOCKING]: {
    key: Modules.LOCKING,
    defaultPackage: false,
    label: upperCaseFirst(Modules.LOCKING),
    isRequired: false,
    isQueryable: false,
    dependencies: [ContainerRegistrationKeys.LOGGER],
    defaultModuleDeclaration: {
      scope: MODULE_SCOPE.INTERNAL,
    },
  },
}

export const MODULE_DEFINITIONS: ModuleDefinition[] =
  Object.values(ModulesDefinition)

export default MODULE_DEFINITIONS
