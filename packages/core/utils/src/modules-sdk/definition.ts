export const Modules = {
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
} as const

export const MODULE_PACKAGE_NAMES = {
  [Modules.AUTH]: "@medusajs/medusa/auth",
  [Modules.CACHE]: "@medusajs/medusa/cache-inmemory",
  [Modules.CART]: "@medusajs/medusa/cart",
  [Modules.CUSTOMER]: "@medusajs/medusa/customer",
  [Modules.EVENT_BUS]: "@medusajs/medusa/event-bus-local",
  [Modules.INVENTORY]: "@medusajs/medusa/inventory",
  [Modules.LINK]: "@medusajs/medusa/link-modules",
  [Modules.PAYMENT]: "@medusajs/medusa/payment",
  [Modules.PRICING]: "@medusajs/medusa/pricing",
  [Modules.PRODUCT]: "@medusajs/medusa/product",
  [Modules.PROMOTION]: "@medusajs/medusa/promotion",
  [Modules.SALES_CHANNEL]: "@medusajs/medusa/sales-channel",
  [Modules.FULFILLMENT]: "@medusajs/medusa/fulfillment",
  [Modules.STOCK_LOCATION]: "@medusajs/medusa/stock-location",
  [Modules.TAX]: "@medusajs/medusa/tax",
  [Modules.USER]: "@medusajs/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "@medusajs/medusa/workflow-engine-inmemory",
  [Modules.REGION]: "@medusajs/medusa/region",
  [Modules.ORDER]: "@medusajs/medusa/order",
  [Modules.API_KEY]: "@medusajs/medusa/api-key",
  [Modules.STORE]: "@medusajs/medusa/store",
  [Modules.CURRENCY]: "@medusajs/medusa/currency",
  [Modules.FILE]: "@medusajs/medusa/file",
  [Modules.NOTIFICATION]: "@medusajs/medusa/notification",
  [Modules.INDEX]: "@medusajs/medusa/index-module",
  [Modules.LOCKING]: "@medusajs/medusa/locking",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
REVERSED_MODULE_PACKAGE_NAMES["@medusajs/medusa/event-bus-redis"] =
  Modules.EVENT_BUS
REVERSED_MODULE_PACKAGE_NAMES["@medusajs/medusa/cache-redis"] = Modules.CACHE
REVERSED_MODULE_PACKAGE_NAMES["@medusajs/medusa/workflow-engine-redis"] =
  Modules.WORKFLOW_ENGINE

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
