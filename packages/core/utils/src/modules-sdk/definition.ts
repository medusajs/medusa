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
  IInventoryServiceNext,
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
  AUTH = "auth",
  CACHE = "cacheService",
  CART = "cart",
  CUSTOMER = "customer",
  EVENT_BUS = "eventBus",
  INVENTORY = "inventoryService",
  LINK = "linkModules",
  PAYMENT = "payment",
  PRICING = "pricingService",
  PRODUCT = "productService",
  PROMOTION = "promotion",
  SALES_CHANNEL = "salesChannel",
  TAX = "tax",
  FULFILLMENT = "fulfillment",
  STOCK_LOCATION = "stockLocationService",
  USER = "user",
  WORKFLOW_ENGINE = "workflows",
  REGION = "region",
  ORDER = "order",
  API_KEY = "apiKey",
  STORE = "store",
  CURRENCY = "currency",
  FILE = "file",
  NOTIFICATION = "notification",
}

export enum ModuleRegistrationName {
  AUTH = "authModuleService",
  CACHE = "cacheService",
  CART = "cartModuleService",
  CUSTOMER = "customerModuleService",
  EVENT_BUS = "eventBusModuleService",
  INVENTORY = "inventoryService",
  PAYMENT = "paymentModuleService",
  PRICING = "pricingModuleService",
  PRODUCT = "productModuleService",
  PROMOTION = "promotionModuleService",
  SALES_CHANNEL = "salesChannelModuleService",
  FULFILLMENT = "fulfillmentModuleService",
  STOCK_LOCATION = "stockLocationService",
  TAX = "taxModuleService",
  USER = "userModuleService",
  WORKFLOW_ENGINE = "workflowsModuleService",
  REGION = "regionModuleService",
  ORDER = "orderModuleService",
  API_KEY = "apiKeyModuleService",
  STORE = "storeModuleService",
  CURRENCY = "currencyModuleService",
  FILE = "fileModuleService",
  NOTIFICATION = "notificationModuleService",
}

declare module "@medusajs/types" {
  export interface ModuleImplementations {
    [ModuleRegistrationName.AUTH]: IAuthModuleService
    [ModuleRegistrationName.CACHE]: ICacheService
    [ModuleRegistrationName.CART]: ICartModuleService
    [ModuleRegistrationName.CUSTOMER]: ICustomerModuleService
    [ModuleRegistrationName.EVENT_BUS]: IEventBusModuleService
    [ModuleRegistrationName.INVENTORY]: IInventoryServiceNext
    [ModuleRegistrationName.PAYMENT]: IPaymentModuleService
    [ModuleRegistrationName.PRICING]: IPricingModuleService
    [ModuleRegistrationName.PRODUCT]: IProductModuleService
    [ModuleRegistrationName.PROMOTION]: IPromotionModuleService
    [ModuleRegistrationName.SALES_CHANNEL]: ISalesChannelModuleService
    [ModuleRegistrationName.TAX]: ITaxModuleService
    [ModuleRegistrationName.FULFILLMENT]: IFulfillmentModuleService
    [ModuleRegistrationName.STOCK_LOCATION]: IStockLocationService
    [ModuleRegistrationName.USER]: IUserModuleService
    [ModuleRegistrationName.WORKFLOW_ENGINE]: IWorkflowEngineService
    [ModuleRegistrationName.REGION]: IRegionModuleService
    [ModuleRegistrationName.ORDER]: IOrderModuleService
    [ModuleRegistrationName.API_KEY]: IApiKeyModuleService
    [ModuleRegistrationName.STORE]: IStoreModuleService
    [ModuleRegistrationName.CURRENCY]: ICurrencyModuleService
    [ModuleRegistrationName.FILE]: IFileModuleService
    [ModuleRegistrationName.NOTIFICATION]: INotificationModuleService
  }
}
