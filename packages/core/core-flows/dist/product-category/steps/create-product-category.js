"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductCategoryStep = exports.createProductCategoryStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createProductCategoryStepId = "create-product-category";
exports.createProductCategoryStep = (0, workflows_sdk_1.createStep)(exports.createProductCategoryStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.createCategory(data.product_category);
    return new workflows_sdk_1.StepResponse(created, created.id);
}, async (createdId, { container }) => {
    if (!createdId) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.deleteCategory(createdId);
});
