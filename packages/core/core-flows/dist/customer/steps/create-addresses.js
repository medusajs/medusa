"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerAddressesStep = exports.createCustomerAddressesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createCustomerAddressesStepId = "create-customer-addresses";
exports.createCustomerAddressesStep = (0, workflows_sdk_1.createStep)(exports.createCustomerAddressesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const addresses = await service.addAddresses(data);
    return new workflows_sdk_1.StepResponse(addresses, addresses.map((address) => address.id));
}, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.deleteAddresses(ids);
});
