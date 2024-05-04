"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrdersStep = exports.createOrdersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createOrdersStepId = "create-orders";
exports.createOrdersStep = (0, workflows_sdk_1.createStep)(exports.createOrdersStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.ORDER);
    const created = await service.create(data);
    return new workflows_sdk_1.StepResponse(created, created.map((store) => store.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.ORDER);
    await service.delete(createdIds);
});
