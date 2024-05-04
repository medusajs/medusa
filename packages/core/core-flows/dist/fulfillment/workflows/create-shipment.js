"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShipmentWorkflow = exports.createShipmentWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const update_fulfillment_workflow_1 = require("../steps/update-fulfillment-workflow");
exports.createShipmentWorkflowId = "create-shipment-workflow";
exports.createShipmentWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createShipmentWorkflowId, (input) => {
    (0, steps_1.validateShipmentStep)(input.id);
    const update = (0, workflows_sdk_1.transform)({ input }, (data) => ({
        ...data.input,
        shipped_at: new Date(),
    }));
    (0, update_fulfillment_workflow_1.updateFulfillmentWorkflowStep)(update);
});
