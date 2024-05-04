"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerGroupsWorkflow = exports.updateCustomerGroupsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCustomerGroupsWorkflowId = "update-customer-groups";
exports.updateCustomerGroupsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCustomerGroupsWorkflowId, (input) => {
    return (0, steps_1.updateCustomerGroupsStep)(input);
});
