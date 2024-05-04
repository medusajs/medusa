"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductCategoryStep = exports.updateProductCategoryStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateProductCategoryStepId = "update-product-category";
exports.updateProductCategoryStep = (0, workflows_sdk_1.createStep)(exports.updateProductCategoryStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.data,
    ]);
    const prevData = await service.listCategories({ id: data.id }, {
        select: selects,
        relations,
    });
    const updated = await service.updateCategory(data.id, data.data);
    return new workflows_sdk_1.StepResponse(updated, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    // TODO: Should be removed when bulk update is implemented
    const category = prevData[0];
    await service.updateCategory(category.id, {
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        is_internal: category.is_internal,
        rank: category.rank,
        handle: category.handle,
        metadata: category.metadata,
        parent_category_id: category.parent_category_id,
    });
});
