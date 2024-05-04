"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProducts = exports.updateProductsWorkflowSteps = exports.UpdateProductsActions = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const definitions_1 = require("../../definitions");
const handlers_1 = require("../../handlers");
const MiddlewareHandlers = __importStar(require("../../handlers/middlewares"));
const product_1 = require("../../handlers/product");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_products_1 = require("./create-products");
const prepare_create_inventory_items_1 = require("./prepare-create-inventory-items");
const update_product_variants_1 = require("./update-product-variants");
var UpdateProductsActions;
(function (UpdateProductsActions) {
    UpdateProductsActions["prepare"] = "prepare";
    UpdateProductsActions["updateProducts"] = "updateProducts";
    UpdateProductsActions["attachSalesChannels"] = "attachSalesChannels";
    UpdateProductsActions["detachSalesChannels"] = "detachSalesChannels";
    UpdateProductsActions["createInventoryItems"] = "createInventoryItems";
    UpdateProductsActions["attachInventoryItems"] = "attachInventoryItems";
    UpdateProductsActions["detachInventoryItems"] = "detachInventoryItems";
    UpdateProductsActions["removeInventoryItems"] = "removeInventoryItems";
})(UpdateProductsActions || (exports.UpdateProductsActions = UpdateProductsActions = {}));
exports.updateProductsWorkflowSteps = {
    next: {
        action: create_products_1.CreateProductsActions.prepare,
        noCompensation: true,
        next: {
            action: UpdateProductsActions.updateProducts,
            next: [
                {
                    action: update_product_variants_1.UpdateProductVariantsActions.upsertPrices,
                    saveResponse: false,
                },
                {
                    action: UpdateProductsActions.attachSalesChannels,
                    saveResponse: false,
                },
                {
                    action: UpdateProductsActions.detachSalesChannels,
                    saveResponse: false,
                },
                {
                    // for created variants
                    action: UpdateProductsActions.createInventoryItems,
                    next: {
                        action: UpdateProductsActions.attachInventoryItems,
                    },
                },
                {
                    // for deleted variants
                    action: UpdateProductsActions.detachInventoryItems,
                    next: {
                        action: UpdateProductsActions.removeInventoryItems,
                    },
                },
            ],
        },
    },
};
const handlers = new Map([
    [
        UpdateProductsActions.prepare,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                inputAlias: definitions_1.InputAlias.ProductsInputData,
                invoke: {
                    from: definitions_1.InputAlias.ProductsInputData,
                },
            }, handlers_1.ProductHandlers.updateProductsPrepareData),
        },
    ],
    [
        UpdateProductsActions.updateProducts,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: definitions_1.InputAlias.ProductsInputData,
                        alias: handlers_1.ProductHandlers.updateProducts.aliases.products,
                    },
                    {
                        from: UpdateProductsActions.prepare,
                    },
                ],
            }, handlers_1.ProductHandlers.updateProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: handlers_1.ProductHandlers.revertUpdateProducts.aliases.preparedData,
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                            .products,
                    },
                ],
            }, MiddlewareHandlers.updateProductsExtractDeletedVariants, handlers_1.ProductHandlers.revertUpdateProducts),
        },
    ],
    [
        UpdateProductsActions.attachSalesChannels,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: "preparedData",
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: handlers_1.ProductHandlers.attachSalesChannelToProducts.aliases.products,
                    },
                ],
            }, MiddlewareHandlers.mapData((d) => ({
                productsHandleSalesChannelsMap: d.preparedData.productHandleAddedChannelsMap,
            })), handlers_1.ProductHandlers.attachSalesChannelToProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: "preparedData",
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: product_1.detachSalesChannelFromProducts.aliases.products,
                    },
                ],
            }, MiddlewareHandlers.mapData((d) => ({
                productsHandleSalesChannelsMap: d.preparedData.productHandleAddedChannelsMap,
            })), handlers_1.ProductHandlers.detachSalesChannelFromProducts),
        },
    ],
    [
        UpdateProductsActions.detachSalesChannels,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: "preparedData",
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: handlers_1.ProductHandlers.detachSalesChannelFromProducts.aliases.products,
                    },
                ],
            }, MiddlewareHandlers.mapData((d) => ({
                productsHandleSalesChannelsMap: d.preparedData.productHandleRemovedChannelsMap,
            })), handlers_1.ProductHandlers.detachSalesChannelFromProducts),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: "preparedData",
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: handlers_1.ProductHandlers.attachSalesChannelToProducts.aliases.products,
                    },
                ],
            }, MiddlewareHandlers.mapData((d) => ({
                productsHandleSalesChannelsMap: d.preparedData.productHandleRemovedChannelsMap,
            })), handlers_1.ProductHandlers.attachSalesChannelToProducts),
        },
    ],
    [
        UpdateProductsActions.createInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: MiddlewareHandlers.updateProductsExtractCreatedVariants.aliases
                            .preparedData,
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: MiddlewareHandlers.updateProductsExtractCreatedVariants.aliases
                            .products,
                    },
                ],
            }, MiddlewareHandlers.updateProductsExtractCreatedVariants, prepare_create_inventory_items_1.prepareCreateInventoryItems, handlers_1.InventoryHandlers.createInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: UpdateProductsActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.removeInventoryItems),
        },
    ],
    [
        UpdateProductsActions.attachInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: UpdateProductsActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.attachInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: UpdateProductsActions.attachInventoryItems,
                    alias: handlers_1.InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.detachInventoryItems),
        },
    ],
    [
        UpdateProductsActions.detachInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                            .preparedData,
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                            .products,
                    },
                ],
            }, MiddlewareHandlers.updateProductsExtractDeletedVariants, MiddlewareHandlers.useVariantsInventoryItems, handlers_1.InventoryHandlers.detachInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.prepare,
                        alias: MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                            .preparedData,
                    },
                    {
                        from: UpdateProductsActions.updateProducts,
                        alias: MiddlewareHandlers.updateProductsExtractDeletedVariants.aliases
                            .products,
                    },
                ],
            }, MiddlewareHandlers.updateProductsExtractDeletedVariants, MiddlewareHandlers.useVariantsInventoryItems, handlers_1.InventoryHandlers.attachInventoryItems),
        },
    ],
    [
        UpdateProductsActions.removeInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: UpdateProductsActions.detachInventoryItems,
                    alias: handlers_1.InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.removeInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductsActions.removeInventoryItems,
                        alias: handlers_1.InventoryHandlers.restoreInventoryItems.aliases.inventoryItems,
                    },
                ],
            }, handlers_1.InventoryHandlers.restoreInventoryItems),
        },
    ],
    [
        update_product_variants_1.UpdateProductVariantsActions.upsertPrices,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: definitions_1.InputAlias.ProductsInputData,
                        alias: handlers_1.ProductHandlers.updateProducts.aliases.products,
                    },
                    {
                        from: UpdateProductsActions.prepare,
                    },
                ],
            }, handlers_1.ProductHandlers.upsertVariantPrices),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: update_product_variants_1.UpdateProductVariantsActions.upsertPrices,
                    },
                ],
            }, handlers_1.ProductHandlers.revertVariantPrices),
        },
    ],
]);
orchestration_1.WorkflowManager.register(definitions_1.Workflows.UpdateProducts, exports.updateProductsWorkflowSteps, handlers);
exports.updateProducts = (0, workflows_sdk_1.exportWorkflow)(definitions_1.Workflows.UpdateProducts, UpdateProductsActions.updateProducts);
