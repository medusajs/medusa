"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollectionsStep = exports.deleteCollectionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteCollectionsStepId = "delete-collections";
exports.deleteCollectionsStep = (0, workflows_sdk_1.createStep)(exports.deleteCollectionsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.softDeleteCollections(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.restoreCollections(prevIds);
});
