"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLineItemAdjustmentsStep = exports.removeLineItemAdjustmentsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.removeLineItemAdjustmentsStepId = "remove-line-item-adjustments";
exports.removeLineItemAdjustmentsStep = (0, workflows_sdk_1.createStep)(exports.removeLineItemAdjustmentsStepId, async (data, { container }) => {
    const { lineItemAdjustmentIdsToRemove = [] } = data;
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await cartModuleService.softDeleteLineItemAdjustments(lineItemAdjustmentIdsToRemove);
    return new workflows_sdk_1.StepResponse(void 0, lineItemAdjustmentIdsToRemove);
}, async (lineItemAdjustmentIdsToRemove, { container }) => {
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!lineItemAdjustmentIdsToRemove?.length) {
        return;
    }
    await cartModuleService.restoreLineItemAdjustments(lineItemAdjustmentIdsToRemove);
});
