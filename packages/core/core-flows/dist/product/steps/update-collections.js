"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCollectionsStep = exports.updateCollectionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateCollectionsStepId = "update-collections";
exports.updateCollectionsStep = (0, workflows_sdk_1.createStep)(exports.updateCollectionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.listCollections(data.selector, {
        select: selects,
        relations,
    });
    const collections = await service.updateCollections(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(collections, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.upsertCollections(prevData.map((r) => ({
        ...r,
    })));
});
