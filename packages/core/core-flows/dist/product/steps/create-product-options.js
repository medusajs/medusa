"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductOptionsStep = exports.createProductOptionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createProductOptionsStepId = "create-product-options";
exports.createProductOptionsStep = (0, workflows_sdk_1.createStep)(exports.createProductOptionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.createOptions(data);
    return new workflows_sdk_1.StepResponse(created, created.map((productOption) => productOption.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.deleteOptions(createdIds);
});
