"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomersWorkflow = exports.updateCustomersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCustomersWorkflowId = "update-customers";
exports.updateCustomersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCustomersWorkflowId, (input) => {
    return (0, steps_1.updateCustomersStep)(input);
});
