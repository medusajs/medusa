"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductsStep = exports.createProductsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createProductsStepId = "create-products";
exports.createProductsStep = (0, workflows_sdk_1.createStep)(exports.createProductsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.create(data);
    return new workflows_sdk_1.StepResponse(created, created.map((product) => product.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.delete(createdIds);
});
