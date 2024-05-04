"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiKeysStep = exports.createApiKeysStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createApiKeysStepId = "create-api-keys";
exports.createApiKeysStep = (0, workflows_sdk_1.createStep)(exports.createApiKeysStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    const created = await service.create(data.api_keys);
    return new workflows_sdk_1.StepResponse(created, created.map((apiKey) => apiKey.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    await service.delete(createdIds);
});
