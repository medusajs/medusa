"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerAddressesWorkflow = exports.createCustomerAddressesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createCustomerAddressesWorkflowId = "create-customer-addresses";
exports.createCustomerAddressesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCustomerAddressesWorkflowId, (input) => {
    const unsetInput = (0, workflows_sdk_1.transform)(input, (data) => ({
        create: data.addresses,
    }));
    (0, workflows_sdk_1.parallelize)((0, steps_1.maybeUnsetDefaultShippingAddressesStep)(unsetInput), (0, steps_1.maybeUnsetDefaultBillingAddressesStep)(unsetInput));
    return (0, steps_1.createCustomerAddressesStep)(input.addresses);
});
