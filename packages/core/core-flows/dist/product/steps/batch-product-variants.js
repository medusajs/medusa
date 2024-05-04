"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProductVariantsStep = exports.batchProductVariantsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const delete_product_variants_1 = require("../workflows/delete-product-variants");
const create_product_variants_1 = require("../workflows/create-product-variants");
const update_product_variants_1 = require("../workflows/update-product-variants");
exports.batchProductVariantsStepId = "batch-product-variants";
exports.batchProductVariantsStep = (0, workflows_sdk_1.createStep)(exports.batchProductVariantsStepId, async (data, { container }) => {
    const { transaction: createTransaction, result: created, errors: createErrors, } = await (0, create_product_variants_1.createProductVariantsWorkflow)(container).run({
        input: { product_variants: data.create ?? [] },
        throwOnError: false,
    });
    if (createErrors?.length) {
        throw createErrors[0].error;
    }
    const { transaction: updateTransaction, result: updated, errors: updateErrors, } = await (0, update_product_variants_1.updateProductVariantsWorkflow)(container).run({
        input: { product_variants: data.update ?? [] },
        throwOnError: false,
    });
    if (updateErrors?.length) {
        throw updateErrors[0].error;
    }
    const { transaction: deleteTransaction, errors: deleteErrors } = await (0, delete_product_variants_1.deleteProductVariantsWorkflow)(container).run({
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
            object: "product_variant",
            deleted: true,
        },
    }, { createTransaction, updateTransaction, deleteTransaction });
}, async (flow, { container }) => {
    if (!flow) {
        return;
    }
    if (flow.createTransaction) {
        await (0, create_product_variants_1.createProductVariantsWorkflow)(container).cancel({
            transaction: flow.createTransaction,
        });
    }
    if (flow.updateTransaction) {
        await (0, update_product_variants_1.updateProductVariantsWorkflow)(container).cancel({
            transaction: flow.updateTransaction,
        });
    }
    if (flow.deleteTransaction) {
        await (0, delete_product_variants_1.deleteProductVariantsWorkflow)(container).cancel({
            transaction: flow.deleteTransaction,
        });
    }
});
