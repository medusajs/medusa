"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoresStep = exports.updateStoresStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateStoresStepId = "update-stores";
exports.updateStoresStep = (0, workflows_sdk_1.createStep)(exports.updateStoresStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const stores = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(stores, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    await service.upsert(prevData.map((r) => ({
        ...r,
        metadata: r.metadata || undefined,
    })));
});
