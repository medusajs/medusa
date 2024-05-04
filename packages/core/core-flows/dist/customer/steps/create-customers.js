"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomersStep = exports.createCustomersStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createCustomersStepId = "create-customers";
exports.createCustomersStep = (0, workflows_sdk_1.createStep)(exports.createCustomersStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const createdCustomers = await service.create(data);
    return new workflows_sdk_1.StepResponse(createdCustomers, createdCustomers.map((createdCustomers) => createdCustomers.id));
}, async (createdCustomerIds, { container }) => {
    if (!createdCustomerIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.delete(createdCustomerIds);
});
