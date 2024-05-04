"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerGroupsWorkflow = exports.createCustomerGroupsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createCustomerGroupsWorkflowId = "create-customer-groups";
exports.createCustomerGroupsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCustomerGroupsWorkflowId, (input) => {
    return (0, steps_1.createCustomerGroupsStep)(input.customersData);
});
