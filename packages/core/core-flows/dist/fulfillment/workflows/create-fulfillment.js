"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFulfillmentWorkflow = exports.createFulfillmentWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createFulfillmentWorkflowId = "create-fulfillment-workflow";
exports.createFulfillmentWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createFulfillmentWorkflowId, (input) => {
    return (0, steps_1.createFulfillmentStep)(input);
});
