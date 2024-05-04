"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_DEFINITIONS = exports.ModulesDefinition = exports.MODULE_PACKAGE_NAMES = exports.ModuleRegistrationName = exports.Modules = exports.LinkModuleUtils = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
var LinkModuleUtils;
(function (LinkModuleUtils) {
    LinkModuleUtils["REMOTE_QUERY"] = "remoteQuery";
    LinkModuleUtils["REMOTE_LINK"] = "remoteLink";
})(LinkModuleUtils || (exports.LinkModuleUtils = LinkModuleUtils = {}));
// TODO: Remove this enum and use the one from @medusajs/utils
var Modules;
(function (Modules) {
    Modules["AUTH"] = "auth";
    Modules["CACHE"] = "cacheService";
    Modules["CART"] = "cart";
    Modules["CUSTOMER"] = "customer";
    Modules["EVENT_BUS"] = "eventBus";
    Modules["INVENTORY"] = "inventoryService";
    Modules["LINK"] = "linkModules";
    Modules["PAYMENT"] = "payment";
    Modules["PRICING"] = "pricingService";
    Modules["PRODUCT"] = "productService";
    Modules["PROMOTION"] = "promotion";
    Modules["SALES_CHANNEL"] = "salesChannel";
    Modules["TAX"] = "tax";
    Modules["FULFILLMENT"] = "fulfillment";
    Modules["STOCK_LOCATION"] = "stockLocationService";
    Modules["USER"] = "user";
    Modules["WORKFLOW_ENGINE"] = "workflows";
    Modules["REGION"] = "region";
    Modules["ORDER"] = "order";
    Modules["API_KEY"] = "apiKey";
    Modules["STORE"] = "store";
    Modules["CURRENCY"] = "currency";
    Modules["FILE"] = "file";
})(Modules || (exports.Modules = Modules = {}));
var ModuleRegistrationName;
(function (ModuleRegistrationName) {
    ModuleRegistrationName["AUTH"] = "authModuleService";
    ModuleRegistrationName["CACHE"] = "cacheService";
    ModuleRegistrationName["CART"] = "cartModuleService";
    ModuleRegistrationName["CUSTOMER"] = "customerModuleService";
    ModuleRegistrationName["EVENT_BUS"] = "eventBusModuleService";
    ModuleRegistrationName["INVENTORY"] = "inventoryService";
    ModuleRegistrationName["PAYMENT"] = "paymentModuleService";
    ModuleRegistrationName["PRICING"] = "pricingModuleService";
    ModuleRegistrationName["PRODUCT"] = "productModuleService";
    ModuleRegistrationName["PROMOTION"] = "promotionModuleService";
    ModuleRegistrationName["SALES_CHANNEL"] = "salesChannelModuleService";
    ModuleRegistrationName["FULFILLMENT"] = "fulfillmentModuleService";
    ModuleRegistrationName["STOCK_LOCATION"] = "stockLocationService";
    ModuleRegistrationName["TAX"] = "taxModuleService";
    ModuleRegistrationName["USER"] = "userModuleService";
    ModuleRegistrationName["WORKFLOW_ENGINE"] = "workflowsModuleService";
    ModuleRegistrationName["REGION"] = "regionModuleService";
    ModuleRegistrationName["ORDER"] = "orderModuleService";
    ModuleRegistrationName["API_KEY"] = "apiKeyModuleService";
    ModuleRegistrationName["STORE"] = "storeModuleService";
    ModuleRegistrationName["CURRENCY"] = "currencyModuleService";
    ModuleRegistrationName["FILE"] = "fileModuleService";
})(ModuleRegistrationName || (exports.ModuleRegistrationName = ModuleRegistrationName = {}));
exports.MODULE_PACKAGE_NAMES = {
    [Modules.AUTH]: "@medusajs/auth",
    [Modules.CACHE]: "@medusajs/cache-inmemory",
    [Modules.CART]: "@medusajs/cart",
    [Modules.CUSTOMER]: "@medusajs/customer",
    [Modules.EVENT_BUS]: "@medusajs/event-bus-local",
    [Modules.INVENTORY]: "@medusajs/inventory-next",
    [Modules.LINK]: "@medusajs/link-modules",
    [Modules.PAYMENT]: "@medusajs/payment",
    [Modules.PRICING]: "@medusajs/pricing",
    [Modules.PRODUCT]: "@medusajs/product",
    [Modules.PROMOTION]: "@medusajs/promotion",
    [Modules.SALES_CHANNEL]: "@medusajs/sales-channel",
    [Modules.FULFILLMENT]: "@medusajs/fulfillment",
    [Modules.STOCK_LOCATION]: "@medusajs/stock-location-next",
    [Modules.TAX]: "@medusajs/tax",
    [Modules.USER]: "@medusajs/user",
    [Modules.WORKFLOW_ENGINE]: "@medusajs/workflow-engine-inmemory",
    [Modules.REGION]: "@medusajs/region",
    [Modules.ORDER]: "@medusajs/order",
    [Modules.API_KEY]: "@medusajs/api-key",
    [Modules.STORE]: "@medusajs/store",
    [Modules.CURRENCY]: "@medusajs/currency",
    [Modules.FILE]: "@medusajs/file",
};
exports.ModulesDefinition = {
    [Modules.EVENT_BUS]: {
        key: Modules.EVENT_BUS,
        isLegacy: true,
        registrationName: ModuleRegistrationName.EVENT_BUS,
        defaultPackage: exports.MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.EVENT_BUS),
        isRequired: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.STOCK_LOCATION]: {
        key: Modules.STOCK_LOCATION,
        isLegacy: true,
        registrationName: ModuleRegistrationName.STOCK_LOCATION,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.STOCK_LOCATION),
        isRequired: false,
        isQueryable: true,
        dependencies: ["eventBusService"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.INVENTORY]: {
        key: Modules.INVENTORY,
        isLegacy: true,
        registrationName: ModuleRegistrationName.INVENTORY,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.INVENTORY),
        isRequired: false,
        isQueryable: true,
        dependencies: ["eventBusService"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.CACHE]: {
        key: Modules.CACHE,
        isLegacy: true,
        registrationName: ModuleRegistrationName.CACHE,
        defaultPackage: exports.MODULE_PACKAGE_NAMES[Modules.CACHE],
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.CACHE),
        isRequired: true,
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.PRODUCT]: {
        key: Modules.PRODUCT,
        registrationName: ModuleRegistrationName.PRODUCT,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.PRODUCT),
        isRequired: false,
        isQueryable: true,
        dependencies: [ModuleRegistrationName.EVENT_BUS, "logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.PRICING]: {
        key: Modules.PRICING,
        registrationName: ModuleRegistrationName.PRICING,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.PRICING),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.PROMOTION]: {
        key: Modules.PROMOTION,
        registrationName: ModuleRegistrationName.PROMOTION,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.PROMOTION),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.AUTH]: {
        key: Modules.AUTH,
        registrationName: ModuleRegistrationName.AUTH,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.AUTH),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.WORKFLOW_ENGINE]: {
        key: Modules.WORKFLOW_ENGINE,
        registrationName: ModuleRegistrationName.WORKFLOW_ENGINE,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.WORKFLOW_ENGINE),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.SALES_CHANNEL]: {
        key: Modules.SALES_CHANNEL,
        registrationName: ModuleRegistrationName.SALES_CHANNEL,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.SALES_CHANNEL),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.FULFILLMENT]: {
        key: Modules.FULFILLMENT,
        registrationName: ModuleRegistrationName.FULFILLMENT,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.FULFILLMENT),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger", "eventBusService"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.CART]: {
        key: Modules.CART,
        registrationName: ModuleRegistrationName.CART,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.CART),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.CUSTOMER]: {
        key: Modules.CUSTOMER,
        registrationName: ModuleRegistrationName.CUSTOMER,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.CUSTOMER),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.PAYMENT]: {
        key: Modules.PAYMENT,
        registrationName: ModuleRegistrationName.PAYMENT,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.PAYMENT),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.USER]: {
        key: Modules.USER,
        registrationName: ModuleRegistrationName.USER,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.USER),
        isRequired: false,
        isQueryable: true,
        dependencies: [ModuleRegistrationName.EVENT_BUS, "logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.REGION]: {
        key: Modules.REGION,
        registrationName: ModuleRegistrationName.REGION,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.REGION),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.ORDER]: {
        key: Modules.ORDER,
        registrationName: ModuleRegistrationName.ORDER,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.ORDER),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger", "eventBusService"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.TAX]: {
        key: Modules.TAX,
        registrationName: ModuleRegistrationName.TAX,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.TAX),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger", "eventBusService"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.API_KEY]: {
        key: Modules.API_KEY,
        registrationName: ModuleRegistrationName.API_KEY,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.API_KEY),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.STORE]: {
        key: Modules.STORE,
        registrationName: ModuleRegistrationName.STORE,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.STORE),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.CURRENCY]: {
        key: Modules.CURRENCY,
        registrationName: ModuleRegistrationName.CURRENCY,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.CURRENCY),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
    [Modules.FILE]: {
        key: Modules.FILE,
        registrationName: ModuleRegistrationName.FILE,
        defaultPackage: false,
        label: (0, utils_1.upperCaseFirst)(ModuleRegistrationName.FILE),
        isRequired: false,
        isQueryable: true,
        dependencies: ["logger"],
        defaultModuleDeclaration: {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
        },
    },
};
exports.MODULE_DEFINITIONS = Object.values(exports.ModulesDefinition);
exports.default = exports.MODULE_DEFINITIONS;
//# sourceMappingURL=definitions.js.map