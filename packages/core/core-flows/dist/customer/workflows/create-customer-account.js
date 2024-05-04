"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerAccountWorkflow = exports.createCustomerAccountWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const steps_2 = require("../../auth/steps");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
exports.createCustomerAccountWorkflowId = "create-customer-account";
exports.createCustomerAccountWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCustomerAccountWorkflowId, (input) => {
    const customers = (0, steps_1.createCustomersStep)([input.customersData]);
    const customer = (0, workflows_sdk_2.transform)(customers, (customers) => customers[0]);
    (0, steps_2.setAuthAppMetadataStep)({
        authUserId: input.authUserId,
        key: "customer_id",
        value: customer.id,
    });
    return customer;
});
