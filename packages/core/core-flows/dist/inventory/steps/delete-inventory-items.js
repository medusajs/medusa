"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryItemStep = exports.deleteInventoryItemStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.deleteInventoryItemStepId = "delete-inventory-item-step";
exports.deleteInventoryItemStep = (0, workflows_sdk_1.createStep)(exports.deleteInventoryItemStepId, async (ids, { container }) => {
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await inventoryService.softDelete(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevInventoryItemIds, { container }) => {
    if (!prevInventoryItemIds?.length) {
        return;
    }
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await inventoryService.restore(prevInventoryItemIds);
});
