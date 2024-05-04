"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerGroupsStep = exports.createCustomerGroupsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createCustomerGroupsStepId = "create-customer-groups";
exports.createCustomerGroupsStep = (0, workflows_sdk_1.createStep)(exports.createCustomerGroupsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const createdCustomerGroups = await service.createCustomerGroup(data);
    return new workflows_sdk_1.StepResponse(createdCustomerGroups, createdCustomerGroups.map((createdCustomerGroups) => createdCustomerGroups.id));
}, async (createdCustomerGroupIds, { container }) => {
    if (!createdCustomerGroupIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.delete(createdCustomerGroupIds);
});
