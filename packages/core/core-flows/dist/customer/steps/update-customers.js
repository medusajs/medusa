"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomersStep = exports.updateCustomersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateCustomersStepId = "update-customer";
exports.updateCustomersStep = (0, workflows_sdk_1.createStep)(exports.updateCustomersStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevCustomers = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const customers = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(customers, prevCustomers);
}, async (prevCustomers, { container }) => {
    if (!prevCustomers?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await (0, utils_1.promiseAll)(prevCustomers.map((c) => service.update(c.id, {
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        phone: c.phone,
        metadata: c.metadata,
    })));
});
