"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerGroupStep = exports.deleteCustomerGroupStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.deleteCustomerGroupStepId = "delete-customer-groups";
exports.deleteCustomerGroupStep = (0, workflows_sdk_1.createStep)(exports.deleteCustomerGroupStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.softDeleteCustomerGroups(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.restoreCustomerGroups(prevCustomerGroups);
});
