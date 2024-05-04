"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingMethodAdjustmentsStep = exports.createShippingMethodAdjustmentsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createShippingMethodAdjustmentsStepId = "create-shipping-method-adjustments";
exports.createShippingMethodAdjustmentsStep = (0, workflows_sdk_1.createStep)(exports.createShippingMethodAdjustmentsStepId, async (data, { container }) => {
    const { shippingMethodAdjustmentsToCreate = [] } = data;
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const createdShippingMethodAdjustments = await cartModuleService.addShippingMethodAdjustments(shippingMethodAdjustmentsToCreate);
    return new workflows_sdk_1.StepResponse(void 0, createdShippingMethodAdjustments);
}, async (createdShippingMethodAdjustments, { container }) => {
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!createdShippingMethodAdjustments?.length) {
        return;
    }
    await cartModuleService.softDeleteShippingMethodAdjustments(createdShippingMethodAdjustments.map((c) => c.id));
});
