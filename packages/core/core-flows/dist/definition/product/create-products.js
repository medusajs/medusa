"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducts = exports.workflowSteps = exports.CreateProductsActions = void 0;
const definitions_1 = require("../../definitions");
const orchestration_1 = require("@medusajs/orchestration");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const handlers_1 = require("../../handlers");
const prepare_create_inventory_items_1 = require("./prepare-create-inventory-items");
var CreateProductsActions;
(function (CreateProductsActions) {
    CreateProductsActions["prepare"] = "prepare";
    CreateProductsActions["createProducts"] = "createProducts";
    CreateProductsActions["attachToSalesChannel"] = "attachToSalesChannel";
    CreateProductsActions["attachShippingProfile"] = "attachShippingProfile";
    CreateProductsActions["createPrices"] = "createPrices";
    CreateProductsActions["createInventoryItems"] = "createInventoryItems";
    CreateProductsActions["attachInventoryItems"] = "attachInventoryItems";
})(CreateProductsActions || (exports.CreateProductsActions = CreateProductsActions = {}));
exports.workflowSteps = {
    next: {
        action: CreateProductsActions.prepare,
        noCompensation: true,
        next: {
            action: CreateProductsActions.createProducts,
            next: [
                {
                    action: CreateProductsActions.attachShippingProfile,
                    saveResponse: false,
                },
                {
                    action: CreateProductsActions.attachToSalesChannel,
                    saveResponse: false,
                },
                {
                    action: CreateProductsActions.createPrices,
                    next: {
                        action: CreateProductsActions.createInventoryItems,
                        next: {
                            action: CreateProductsActions.attachInventoryItems,
                        },
                    },
                },
            ],
        },
    },
};
const handlers = new Map([
    [
        CreateProductsActions.prepare,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                inputAlias: definitions_1.InputAlias.ProductsInputData,
                invoke: {
                    from: definitions_1.InputAlias.ProductsInputData,
                },
            }, handlers_1.ProductHandlers.createProductsPrepareData),
        },
    ],
    [
        CreateProductsActions.createProducts,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.prepare,
                },
            }, handlers_1.ProductHandlers.createProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.createProducts,
                    alias: handlers_1.ProductHandlers.removeProducts.aliases.products,
                },
            }, handlers_1.ProductHandlers.removeProducts),
        },
    ],
    [
        CreateProductsActions.attachShippingProfile,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.attachShippingProfileToProducts.aliases
                            .products,
                    },
                ],
            }, handlers_1.ProductHandlers.attachShippingProfileToProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.detachShippingProfileFromProducts.aliases
                            .products,
                    },
                ],
            }, handlers_1.ProductHandlers.detachShippingProfileFromProducts),
        },
    ],
    [
        CreateProductsActions.attachToSalesChannel,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.attachSalesChannelToProducts.aliases.products,
                    },
                ],
            }, handlers_1.ProductHandlers.attachSalesChannelToProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.detachSalesChannelFromProducts.aliases.products,
                    },
                ],
            }, handlers_1.ProductHandlers.detachSalesChannelFromProducts),
        },
    ],
    [
        CreateProductsActions.createInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.createProducts,
                    alias: prepare_create_inventory_items_1.prepareCreateInventoryItems.aliases.products,
                },
            }, prepare_create_inventory_items_1.prepareCreateInventoryItems, handlers_1.InventoryHandlers.createInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.removeInventoryItems),
        },
    ],
    [
        CreateProductsActions.attachInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.attachInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductsActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.detachInventoryItems),
        },
    ],
    [
        CreateProductsActions.createPrices,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.updateProductsVariantsPrices.aliases.products,
                    },
                ],
            }, handlers_1.ProductHandlers.updateProductsVariantsPrices),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductsActions.prepare,
                        alias: handlers_1.MiddlewaresHandlers
                            .createProductsPrepareCreatePricesCompensation.aliases
                            .preparedData,
                    },
                    {
                        from: CreateProductsActions.createProducts,
                        alias: handlers_1.ProductHandlers.updateProductsVariantsPrices.aliases.products,
                    },
                ],
            }, handlers_1.MiddlewaresHandlers.createProductsPrepareCreatePricesCompensation, handlers_1.ProductHandlers.updateProductsVariantsPrices),
        },
    ],
]);
orchestration_1.WorkflowManager.register(definitions_1.Workflows.CreateProducts, exports.workflowSteps, handlers);
exports.createProducts = (0, workflows_sdk_1.exportWorkflow)(definitions_1.Workflows.CreateProducts, CreateProductsActions.createProducts);
