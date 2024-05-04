"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerGroupCustomersStep = exports.deleteCustomerGroupCustomersStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.deleteCustomerGroupCustomersStepId = "delete-customer-group-customers";
exports.deleteCustomerGroupCustomersStep = (0, workflows_sdk_1.createStep)(exports.deleteCustomerGroupCustomersStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.removeCustomerFromGroup(data);
    return new workflows_sdk_1.StepResponse(void 0, data);
}, async (groupPairs, { container }) => {
    if (!groupPairs?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.addCustomerToGroup(groupPairs);
});
