import { ModuleDefinition } from "@medusajs/types";
export declare enum LinkModuleUtils {
    REMOTE_QUERY = "remoteQuery",
    REMOTE_LINK = "remoteLink"
}
export declare enum Modules {
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
    FILE = "file"
}
export declare enum ModuleRegistrationName {
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
    FILE = "fileModuleService"
}
export declare const MODULE_PACKAGE_NAMES: {
    auth: string;
    cacheService: string;
    cart: string;
    customer: string;
    eventBus: string;
    inventoryService: string;
    linkModules: string;
    payment: string;
    pricingService: string;
    productService: string;
    promotion: string;
    salesChannel: string;
    fulfillment: string;
    stockLocationService: string;
    tax: string;
    user: string;
    workflows: string;
    region: string;
    order: string;
    apiKey: string;
    store: string;
    currency: string;
    file: string;
};
export declare const ModulesDefinition: {
    [key: string | Modules]: ModuleDefinition;
};
export declare const MODULE_DEFINITIONS: ModuleDefinition[];
export default MODULE_DEFINITIONS;
