"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductTypesStep = exports.updateProductTypesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateProductTypesStepId = "update-product-types";
exports.updateProductTypesStep = (0, workflows_sdk_1.createStep)(exports.updateProductTypesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.listTypes(data.selector, {
        select: selects,
        relations,
    });
    const productTypes = await service.updateTypes(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(productTypes, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.upsertTypes(prevData);
});
