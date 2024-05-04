"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelFulfillmentStep = exports.cancelFulfillmentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.cancelFulfillmentStepId = "cancel-fulfillment";
exports.cancelFulfillmentStep = (0, workflows_sdk_1.createStep)(exports.cancelFulfillmentStepId, async (id, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.cancelFulfillment(id);
    return new workflows_sdk_1.StepResponse(void 0, id);
});
