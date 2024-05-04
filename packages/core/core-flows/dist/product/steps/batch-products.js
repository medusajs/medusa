"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProductsStep = exports.batchProductsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_products_1 = require("../workflows/create-products");
const update_products_1 = require("../workflows/update-products");
const delete_products_1 = require("../workflows/delete-products");
exports.batchProductsStepId = "batch-products";
exports.batchProductsStep = (0, workflows_sdk_1.createStep)(exports.batchProductsStepId, async (data, { container }) => {
    const { transaction: createTransaction, result: created, errors: createErrors, } = await (0, create_products_1.createProductsWorkflow)(container).run({
        input: { products: data.create ?? [] },
        throwOnError: false,
    });
    if (createErrors?.length) {
        throw createErrors[0].error;
    }
    const { transaction: updateTransaction, result: updated, errors: updateErrors, } = await (0, update_products_1.updateProductsWorkflow)(container).run({
        input: { products: data.update ?? [] },
        throwOnError: false,
    });
    if (updateErrors?.length) {
        throw updateErrors[0].error;
    }
    const { transaction: deleteTransaction, errors: deleteErrors } = await (0, delete_products_1.deleteProductsWorkflow)(container).run({
        input: { ids: data.delete ?? [] },
        throwOnError: false,
    });
    if (deleteErrors?.length) {
        throw deleteErrors[0].error;
    }
    return new workflows_sdk_1.StepResponse({
        created,
        updated,
        deleted: {
            ids: data.delete ?? [],
            object: "product",
            deleted: true,
        },
    }, { createTransaction, updateTransaction, deleteTransaction });
}, async (flow, { container }) => {
    if (!flow) {
        return;
    }
    if (flow.createTransaction) {
        await (0, create_products_1.createProductsWorkflow)(container).cancel({
            transaction: flow.createTransaction,
        });
    }
    if (flow.updateTransaction) {
        await (0, update_products_1.updateProductsWorkflow)(container).cancel({
            transaction: flow.updateTransaction,
        });
    }
    if (flow.deleteTransaction) {
        await (0, delete_products_1.deleteProductsWorkflow)(container).cancel({
            transaction: flow.deleteTransaction,
        });
    }
});
