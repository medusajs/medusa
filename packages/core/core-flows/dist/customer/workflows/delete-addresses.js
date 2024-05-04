"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerAddressesWorkflow = exports.deleteCustomerAddressesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteCustomerAddressesWorkflowId = "delete-customer-addresses";
exports.deleteCustomerAddressesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteCustomerAddressesWorkflowId, (input) => {
    return (0, steps_1.deleteCustomerAddressesStep)(input.ids);
});
