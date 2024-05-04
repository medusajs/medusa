"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFulfillmentStep = exports.createFulfillmentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createFulfillmentStepId = "create-fulfillment";
exports.createFulfillmentStep = (0, workflows_sdk_1.createStep)(exports.createFulfillmentStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const fulfillment = await service.createFulfillment(data);
    return new workflows_sdk_1.StepResponse(fulfillment, fulfillment.id);
}, async (id, { container }) => {
    if (!id) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.cancelFulfillment(id);
});
