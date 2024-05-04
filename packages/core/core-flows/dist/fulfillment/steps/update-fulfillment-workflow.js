"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFulfillmentWorkflowStep = exports.updateFulfillmentWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_fulfillment_1 = require("../workflows/update-fulfillment");
exports.updateFulfillmentWorkflowStepId = "update-fulfillment-workflow";
exports.updateFulfillmentWorkflowStep = (0, workflows_sdk_1.createStep)(exports.updateFulfillmentWorkflowStepId, async (data, { container }) => {
    const { transaction, result: updated, errors, } = await (0, update_fulfillment_1.updateFulfillmentWorkflow)(container).run({
        input: data,
        throwOnError: false,
    });
    if (Array.isArray(errors) && errors[0]) {
        throw errors[0].error;
    }
    return new workflows_sdk_1.StepResponse(updated, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, update_fulfillment_1.updateFulfillmentWorkflow)(container).cancel({ transaction });
});
