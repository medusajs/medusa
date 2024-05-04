"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductTypesStep = exports.createProductTypesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createProductTypesStepId = "create-product-types";
exports.createProductTypesStep = (0, workflows_sdk_1.createStep)(exports.createProductTypesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.createTypes(data);
    return new workflows_sdk_1.StepResponse(created, created.map((productType) => productType.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.deleteTypes(createdIds);
});
