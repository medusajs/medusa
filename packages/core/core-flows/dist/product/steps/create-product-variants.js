"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariantsStep = exports.createProductVariantsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createProductVariantsStepId = "create-product-variants";
exports.createProductVariantsStep = (0, workflows_sdk_1.createStep)(exports.createProductVariantsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.createVariants(data);
    return new workflows_sdk_1.StepResponse(created, created.map((productVariant) => productVariant.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.deleteVariants(createdIds);
});
