"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApiKeysStep = exports.updateApiKeysStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateApiKeysStepId = "update-api-keys";
exports.updateApiKeysStep = (0, workflows_sdk_1.createStep)(exports.updateApiKeysStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const apiKeys = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(apiKeys, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    await service.upsert(prevData.map((r) => ({
        id: r.id,
        title: r.title,
    })));
});
