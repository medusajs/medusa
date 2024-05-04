"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsStep = exports.updateProductsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateProductsStepId = "update-products";
exports.updateProductsStep = (0, workflows_sdk_1.createStep)(exports.updateProductsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    if ("products" in data) {
        if (data.products.some((p) => !p.id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Product ID is required when doing a batch update of products");
        }
        const prevData = await service.list({
            id: data.products.map((p) => p.id),
        });
        const products = await service.upsert(data.products);
        return new workflows_sdk_1.StepResponse(products, prevData);
    }
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const products = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(products, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.upsert(prevData.map((r) => ({
        ...r,
    })));
});
