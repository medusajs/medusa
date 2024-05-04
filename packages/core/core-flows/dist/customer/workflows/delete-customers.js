"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomersWorkflow = exports.deleteCustomersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteCustomersWorkflowId = "delete-customers";
exports.deleteCustomersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteCustomersWorkflowId, (input) => {
    return (0, steps_1.deleteCustomersStep)(input.ids);
});
