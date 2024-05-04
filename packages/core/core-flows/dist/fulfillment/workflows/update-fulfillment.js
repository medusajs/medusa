"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFulfillmentWorkflow = exports.updateFulfillmentWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateFulfillmentWorkflowId = "update-fulfillment-workflow";
exports.updateFulfillmentWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateFulfillmentWorkflowId, (input) => {
    (0, steps_1.updateFulfillmentStep)(input);
});
