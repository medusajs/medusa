"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductOptionsStep = exports.updateProductOptionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateProductOptionsStepId = "update-product-options";
exports.updateProductOptionsStep = (0, workflows_sdk_1.createStep)(exports.updateProductOptionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.listOptions(data.selector, {
        select: selects,
        relations,
    });
    const productOptions = await service.updateOptions(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(productOptions, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.upsertOptions(prevData.map((o) => ({
        ...o,
        values: o.values?.map((v) => v.value),
        product: undefined,
        product_id: o.product_id ?? undefined,
    })));
});
