"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariantsStep = exports.updateProductVariantsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateProductVariantsStepId = "update-product-variants";
exports.updateProductVariantsStep = (0, workflows_sdk_1.createStep)(exports.updateProductVariantsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    if ("product_variants" in data) {
        if (data.product_variants.some((p) => !p.id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Product variant ID is required when doing a batch update of product variants");
        }
        const prevData = await service.listVariants({
            id: data.product_variants.map((p) => p.id),
        });
        const productVariants = await service.upsertVariants(data.product_variants);
        return new workflows_sdk_1.StepResponse(productVariants, prevData);
    }
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.listVariants(data.selector, {
        select: selects,
        relations,
    });
    const productVariants = await service.updateVariants(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(productVariants, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.upsertVariants(prevData);
});
