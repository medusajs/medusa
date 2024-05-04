"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegionsStep = exports.deleteRegionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteRegionsStepId = "delete-regions";
exports.deleteRegionsStep = (0, workflows_sdk_1.createStep)(exports.deleteRegionsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    await service.softDelete(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    await service.restore(prevIds);
});
