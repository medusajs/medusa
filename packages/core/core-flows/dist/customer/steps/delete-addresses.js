"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerAddressesStep = exports.deleteCustomerAddressesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteCustomerAddressesStepId = "delete-customer-addresses";
exports.deleteCustomerAddressesStep = (0, workflows_sdk_1.createStep)(exports.deleteCustomerAddressesStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    const existing = await service.listAddresses({
        id: ids,
    });
    await service.deleteAddresses(ids);
    return new workflows_sdk_1.StepResponse(void 0, existing);
}, async (prevAddresses, { container }) => {
    if (!prevAddresses?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await service.addAddresses(prevAddresses);
});
