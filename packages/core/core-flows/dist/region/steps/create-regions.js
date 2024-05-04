"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegionsStep = exports.createRegionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createRegionsStepId = "create-regions";
exports.createRegionsStep = (0, workflows_sdk_1.createStep)(exports.createRegionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    const created = await service.create(data);
    return new workflows_sdk_1.StepResponse(created, created.map((region) => region.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    await service.delete(createdIds);
});
