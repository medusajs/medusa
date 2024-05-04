"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineItemAdjustmentsStep = exports.createLineItemAdjustmentsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createLineItemAdjustmentsStepId = "create-line-item-adjustments";
exports.createLineItemAdjustmentsStep = (0, workflows_sdk_1.createStep)(exports.createLineItemAdjustmentsStepId, async (data, { container }) => {
    const { lineItemAdjustmentsToCreate = [] } = data;
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const createdLineItemAdjustments = await cartModuleService.addLineItemAdjustments(lineItemAdjustmentsToCreate);
    return new workflows_sdk_1.StepResponse(void 0, createdLineItemAdjustments);
}, async (createdLineItemAdjustments, { container }) => {
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!createdLineItemAdjustments?.length) {
        return;
    }
    await cartModuleService.softDeleteLineItemAdjustments(createdLineItemAdjustments.map((c) => c.id));
});
