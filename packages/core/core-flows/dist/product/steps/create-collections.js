"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionsStep = exports.createCollectionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createCollectionsStepId = "create-collections";
exports.createCollectionsStep = (0, workflows_sdk_1.createStep)(exports.createCollectionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const created = await service.createCollections(data);
    return new workflows_sdk_1.StepResponse(created, created.map((collection) => collection.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.deleteCollections(createdIds);
});
