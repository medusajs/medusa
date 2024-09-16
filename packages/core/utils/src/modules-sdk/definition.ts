import type {
  IApiKeyModuleService,
  IAuthModuleService,
  ICacheService,
  ICartModuleService,
  ICurrencyModuleService,
  ICustomerModuleService,
  IEventBusModuleService,
  IFileModuleService,
  IFulfillmentModuleService,
  IInventoryService,
  INotificationModuleService,
  IOrderModuleService,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
  IStoreModuleService,
  ITaxModuleService,
  IUserModuleService,
  IWorkflowEngineService,
} from "@medusajs/types"

export enum Modules {
  AUTH = "Auth",
  CACHE = "Cache",
  CART = "Cart",
  CUSTOMER = "Customer",
  EVENT_BUS = "EventBus",
  INVENTORY = "Inventory",
  LINK = "LinkModules",
  PAYMENT = "Payment",
  PRICING = "Pricing",
  PRODUCT = "Product",
  PROMOTION = "Promotion",
  SALES_CHANNEL = "SalesChannel",
  TAX = "Tax",
  FULFILLMENT = "Fulfillment",
  STOCK_LOCATION = "StockLocation",
  USER = "User",
  WORKFLOW_ENGINE = "Workflows",
  REGION = "Region",
  ORDER = "Order",
  API_KEY = "ApiKey",
  STORE = "Store",
  CURRENCY = "Currency",
  FILE = "File",
  NOTIFICATION = "Notification",
  INDEX = "Index",
}

export const ModuleRegistrationName = Modules

declare module "@medusajs/types" {
  export interface ModuleImplementations {
    [Modules.AUTH]: IAuthModuleService
    [Modules.CACHE]: ICacheService
    [Modules.CART]: ICartModuleService
    [Modules.CUSTOMER]: ICustomerModuleService
    [Modules.EVENT_BUS]: IEventBusModuleService
    [Modules.INVENTORY]: IInventoryService
    [Modules.PAYMENT]: IPaymentModuleService
    [Modules.PRICING]: IPricingModuleService
    [Modules.PRODUCT]: IProductModuleService
    [Modules.PROMOTION]: IPromotionModuleService
    [Modules.SALES_CHANNEL]: ISalesChannelModuleService
    [Modules.TAX]: ITaxModuleService
    [Modules.FULFILLMENT]: IFulfillmentModuleService
    [Modules.STOCK_LOCATION]: IStockLocationService
    [Modules.USER]: IUserModuleService
    [Modules.WORKFLOW_ENGINE]: IWorkflowEngineService
    [Modules.REGION]: IRegionModuleService
    [Modules.ORDER]: IOrderModuleService
    [Modules.API_KEY]: IApiKeyModuleService
    [Modules.STORE]: IStoreModuleService
    [Modules.CURRENCY]: ICurrencyModuleService
    [Modules.FILE]: IFileModuleService
    [Modules.NOTIFICATION]: INotificationModuleService
    [ModuleRegistrationName.INDEX]: any // TODO: define index module interface
  }
}
