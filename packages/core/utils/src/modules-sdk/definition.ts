export const Modules = {
  ANALYTICS: "analytics",
  AUTH: "auth",
  CACHE: "cache",
  CART: "cart",
  CUSTOMER: "customer",
  EVENT_BUS: "event_bus",
  INVENTORY: "inventory",
  LINK: "link_modules",
  PAYMENT: "payment",
  PRICING: "pricing",
  PRODUCT: "product",
  PROMOTION: "promotion",
  SALES_CHANNEL: "sales_channel",
  TAX: "tax",
  FULFILLMENT: "fulfillment",
  STOCK_LOCATION: "stock_location",
  USER: "user",
  WORKFLOW_ENGINE: "workflows",
  REGION: "region",
  ORDER: "order",
  API_KEY: "api_key",
  STORE: "store",
  CURRENCY: "currency",
  FILE: "file",
  NOTIFICATION: "notification",
  INDEX: "index",
  LOCKING: "locking",
  SETTINGS: "settings",
  CACHING: "caching",
  TRANSLATION: "translation",
  RBAC: "rbac",
} as const

export const MODULE_PACKAGE_NAMES = {
  [Modules.ANALYTICS]: "@zjedene-medusa/medusa/analytics",
  [Modules.AUTH]: "@zjedene-medusa/medusa/auth",
  [Modules.CACHE]: "@zjedene-medusa/medusa/cache-inmemory",
  [Modules.CART]: "@zjedene-medusa/medusa/cart",
  [Modules.CUSTOMER]: "@zjedene-medusa/medusa/customer",
  [Modules.EVENT_BUS]: "@zjedene-medusa/medusa/event-bus-local",
  [Modules.INVENTORY]: "@zjedene-medusa/medusa/inventory",
  [Modules.LINK]: "@zjedene-medusa/medusa/link-modules",
  [Modules.PAYMENT]: "@zjedene-medusa/medusa/payment",
  [Modules.PRICING]: "@zjedene-medusa/medusa/pricing",
  [Modules.PRODUCT]: "@zjedene-medusa/medusa/product",
  [Modules.PROMOTION]: "@zjedene-medusa/medusa/promotion",
  [Modules.SALES_CHANNEL]: "@zjedene-medusa/medusa/sales-channel",
  [Modules.FULFILLMENT]: "@zjedene-medusa/medusa/fulfillment",
  [Modules.STOCK_LOCATION]: "@zjedene-medusa/medusa/stock-location",
  [Modules.TAX]: "@zjedene-medusa/medusa/tax",
  [Modules.USER]: "@zjedene-medusa/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "@zjedene-medusa/medusa/workflow-engine-inmemory",
  [Modules.REGION]: "@zjedene-medusa/medusa/region",
  [Modules.ORDER]: "@zjedene-medusa/medusa/order",
  [Modules.API_KEY]: "@zjedene-medusa/medusa/api-key",
  [Modules.STORE]: "@zjedene-medusa/medusa/store",
  [Modules.CURRENCY]: "@zjedene-medusa/medusa/currency",
  [Modules.FILE]: "@zjedene-medusa/medusa/file",
  [Modules.NOTIFICATION]: "@zjedene-medusa/medusa/notification",
  [Modules.INDEX]: "@zjedene-medusa/medusa/index-module",
  [Modules.LOCKING]: "@zjedene-medusa/medusa/locking",
  [Modules.SETTINGS]: "@zjedene-medusa/medusa/settings",
  [Modules.CACHING]: "@zjedene-medusa/medusa/caching",
  [Modules.TRANSLATION]: "@zjedene-medusa/medusa/translation",
  [Modules.RBAC]: "@zjedene-medusa/medusa/rbac",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
export const TEMPORARY_REDIS_MODULE_PACKAGE_NAMES = {
  [Modules.EVENT_BUS]: "@zjedene-medusa/medusa/event-bus-redis",
  [Modules.CACHE]: "@zjedene-medusa/medusa/cache-redis",
  [Modules.WORKFLOW_ENGINE]: "@zjedene-medusa/medusa/workflow-engine-redis",
  [Modules.LOCKING]: "@zjedene-medusa/medusa/locking-redis",
}

REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.EVENT_BUS]
] = Modules.EVENT_BUS
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.CACHE]
] = Modules.CACHE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE]
] = Modules.WORKFLOW_ENGINE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.LOCKING]
] = Modules.LOCKING

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
