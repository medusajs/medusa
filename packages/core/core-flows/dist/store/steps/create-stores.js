"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoresStep = exports.createStoresStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createStoresStepId = "create-stores";
exports.createStoresStep = (0, workflows_sdk_1.createStep)(exports.createStoresStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    const created = await service.create(data.stores);
    return new workflows_sdk_1.StepResponse(created, created.map((store) => store.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    await service.delete(createdIds);
});
