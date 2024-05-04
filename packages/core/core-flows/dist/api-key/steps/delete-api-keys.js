"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApiKeysStep = exports.deleteApiKeysStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteApiKeysStepId = "delete-api-keys";
exports.deleteApiKeysStep = (0, workflows_sdk_1.createStep)({ name: exports.deleteApiKeysStepId, noCompensation: true }, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.API_KEY);
    await service.delete(ids);
    return new workflows_sdk_1.StepResponse(void 0);
}, async () => { });
