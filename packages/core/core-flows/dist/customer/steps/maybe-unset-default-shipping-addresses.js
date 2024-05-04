"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeUnsetDefaultShippingAddressesStep = exports.maybeUnsetDefaultShippingAddressesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("./utils");
const utils_2 = require("@medusajs/utils");
exports.maybeUnsetDefaultShippingAddressesStepId = "maybe-unset-default-shipping-customer-addresses";
exports.maybeUnsetDefaultShippingAddressesStep = (0, workflows_sdk_1.createStep)(exports.maybeUnsetDefaultShippingAddressesStepId, async (data, { container }) => {
    const customerModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    if ((0, utils_2.isDefined)(data.create)) {
        return (0, utils_1.unsetForCreate)(data.create, customerModuleService, "is_default_shipping");
    }
    if ((0, utils_2.isDefined)(data.update)) {
        return (0, utils_1.unsetForUpdate)(data.update, customerModuleService, "is_default_shipping");
    }
    throw new Error("Invalid step input");
}, async (addressesToSet, { container }) => {
    if (!addressesToSet?.length) {
        return;
    }
    const customerModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CUSTOMER);
    await customerModuleService.updateAddresses({ id: addressesToSet }, { is_default_shipping: true });
});
