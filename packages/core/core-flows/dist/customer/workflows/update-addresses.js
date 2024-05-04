"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerAddressesWorkflow = exports.updateCustomerAddressesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCustomerAddressesWorkflowId = "update-customer-addresses";
exports.updateCustomerAddressesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCustomerAddressesWorkflowId, (input) => {
    const unsetInput = (0, workflows_sdk_1.transform)(input, (data) => ({
        update: data,
    }));
    (0, workflows_sdk_1.parallelize)((0, steps_1.maybeUnsetDefaultShippingAddressesStep)(unsetInput), (0, steps_1.maybeUnsetDefaultBillingAddressesStep)(unsetInput));
    return (0, steps_1.updateCustomerAddressesStep)(input);
});
