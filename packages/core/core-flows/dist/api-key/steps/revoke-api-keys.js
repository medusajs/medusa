"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeApiKeysStep = exports.revokeApiKeysStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.revokeApiKeysStepId = "revoke-api-keys";
exports.revokeApiKeysStep = (0, workflows_sdk_1.createStep)({ name: exports.revokeApiKeysStepId, noCompensation: true }, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    const apiKeys = await service.revoke(data.selector, data.revoke);
    return new workflows_sdk_1.StepResponse(apiKeys);
}, async () => { });
