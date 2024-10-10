export const Modules = {
  AUTH: "Auth",
  CACHE: "Cache",
  CART: "Cart",
  CUSTOMER: "Customer",
  EVENT_BUS: "EventBus",
  INVENTORY: "Inventory",
  LINK: "LinkModules",
  PAYMENT: "Payment",
  PRICING: "Pricing",
  PRODUCT: "Product",
  PROMOTION: "Promotion",
  SALES_CHANNEL: "SalesChannel",
  TAX: "Tax",
  FULFILLMENT: "Fulfillment",
  STOCK_LOCATION: "StockLocation",
  USER: "User",
  WORKFLOW_ENGINE: "Workflows",
  REGION: "Region",
  ORDER: "Order",
  API_KEY: "ApiKey",
  STORE: "Store",
  CURRENCY: "Currency",
  FILE: "File",
  NOTIFICATION: "Notification",
  INDEX: "Index",
} as const

export const MODULE_PACKAGE_NAMES = {
  [Modules.AUTH]: "@medusajs/medusa/auth",
  [Modules.CACHE]: "@medusajs/medusa/cache-inmemory",
  [Modules.CART]: "@medusajs/medusa/cart",
  [Modules.CUSTOMER]: "@medusajs/medusa/customer",
  [Modules.EVENT_BUS]: "@medusajs/medusa/event-bus-local",
  [Modules.INVENTORY]: "@medusajs/medusa/inventory-next", // TODO: To be replaced when current `@medusajs/inventory` is deprecated
  [Modules.LINK]: "@medusajs/medusa/link-modules",
  [Modules.PAYMENT]: "@medusajs/medusa/payment",
  [Modules.PRICING]: "@medusajs/medusa/pricing",
  [Modules.PRODUCT]: "@medusajs/medusa/product",
  [Modules.PROMOTION]: "@medusajs/medusa/promotion",
  [Modules.SALES_CHANNEL]: "@medusajs/medusa/sales-channel",
  [Modules.FULFILLMENT]: "@medusajs/medusa/fulfillment",
  [Modules.STOCK_LOCATION]: "@medusajs/medusa/stock-location-next", // TODO: To be replaced when current `@medusajs/stock-location` is deprecated
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
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
