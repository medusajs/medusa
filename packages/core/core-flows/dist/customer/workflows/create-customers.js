"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomersWorkflow = exports.createCustomersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createCustomersWorkflowId = "create-customers";
exports.createCustomersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCustomersWorkflowId, (input) => {
    return (0, steps_1.createCustomersStep)(input.customersData);
});
