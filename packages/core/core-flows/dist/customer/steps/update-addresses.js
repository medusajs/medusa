"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerAddressesStep = exports.updateCustomerAddresseStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateCustomerAddresseStepId = "update-customer-addresses";
exports.updateCustomerAddressesStep = (0, workflows_sdk_1.createStep)(exports.updateCustomerAddresseStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevCustomers = await service.listAddresses(data.selector, {
        select: selects,
        relations,
    });
    const customerAddresses = await service.updateAddresses(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(customerAddresses, prevCustomers);
}, async (prevCustomerAddresses, { container }) => {
    if (!prevCustomerAddresses) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await (0, utils_1.promiseAll)(prevCustomerAddresses.map((c) => service.updateAddresses(c.id, { ...c })));
});
