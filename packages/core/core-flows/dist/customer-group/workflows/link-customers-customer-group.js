"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkCustomersToCustomerGroupWorkflow = exports.linkCustomersToCustomerGroupWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.linkCustomersToCustomerGroupWorkflowId = "link-customers-to-customer-group";
exports.linkCustomersToCustomerGroupWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.linkCustomersToCustomerGroupWorkflowId, (input) => {
    return (0, steps_1.linkCustomersToCustomerGroupStep)(input);
});
