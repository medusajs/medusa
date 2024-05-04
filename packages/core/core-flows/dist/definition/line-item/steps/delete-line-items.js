"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLineItemsStep = exports.deleteLineItemsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteLineItemsStepId = "delete-line-items";
exports.deleteLineItemsStep = (0, workflows_sdk_1.createStep)(exports.deleteLineItemsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await service.softDeleteLineItems(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await service.restoreLineItems(ids);
});
