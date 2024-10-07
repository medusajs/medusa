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

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
