"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeShippingMethodAdjustmentsStep = exports.removeShippingMethodAdjustmentsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.removeShippingMethodAdjustmentsStepId = "remove-shipping-method-adjustments";
exports.removeShippingMethodAdjustmentsStep = (0, workflows_sdk_1.createStep)(exports.removeShippingMethodAdjustmentsStepId, async (data, { container }) => {
    const { shippingMethodAdjustmentIdsToRemove = [] } = data;
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await cartModuleService.softDeleteShippingMethodAdjustments(shippingMethodAdjustmentIdsToRemove);
    return new workflows_sdk_1.StepResponse(void 0, shippingMethodAdjustmentIdsToRemove);
}, async (shippingMethodAdjustmentIdsToRemove, { container }) => {
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!shippingMethodAdjustmentIdsToRemove?.length) {
        return;
    }
    await cartModuleService.restoreShippingMethodAdjustments(shippingMethodAdjustmentIdsToRemove);
});
