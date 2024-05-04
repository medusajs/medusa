"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFulfillmentStep = exports.updateFulfillmentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateFulfillmentStepId = "update-fulfillment";
exports.updateFulfillmentStep = (0, workflows_sdk_1.createStep)(exports.updateFulfillmentStepId, async (input, { container }) => {
    const { id, ...data } = input;
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([data]);
    const fulfillment = await service.retrieveFulfillment(id, {
        select: selects,
        relations,
    });
    await service.updateFulfillment(id, data);
    return new workflows_sdk_1.StepResponse(void 0, fulfillment);
}, async (fulfillment, { container }) => {
    if (!fulfillment) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const { id, ...data } = fulfillment;
    // TODO: this does not revert the relationships that are created in invoke step
    // There should be a consistent way to handle across workflows
    await service.updateFulfillment(id, data);
});
