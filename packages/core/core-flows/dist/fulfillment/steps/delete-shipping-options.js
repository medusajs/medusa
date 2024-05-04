"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingOptionsStep = exports.deleteShippingOptionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
exports.deleteShippingOptionsStepId = "delete-shipping-options-step";
exports.deleteShippingOptionsStep = (0, workflows_sdk_1.createStep)(exports.deleteShippingOptionsStepId, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const softDeletedEntities = await service.softDeleteShippingOptions(ids);
    return new workflows_sdk_1.StepResponse({
        [utils_1.Modules.FULFILLMENT]: softDeletedEntities,
    }, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.restoreShippingOptions(prevIds);
});
