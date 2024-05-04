"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductVariantsStep = exports.deleteProductVariantsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteProductVariantsStepId = "delete-product-variants";
exports.deleteProductVariantsStep = (0, workflows_sdk_1.createStep)(exports.deleteProductVariantsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.softDeleteVariants(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.restoreVariants(prevIds);
});
