"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryItemsStep = exports.createInventoryItemsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createInventoryItemsStepId = "create-inventory-items";
exports.createInventoryItemsStep = (0, workflows_sdk_1.createStep)(exports.createInventoryItemsStepId, async (data, { container }) => {
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const createdItems = await inventoryService.create(data);
    return new workflows_sdk_1.StepResponse(createdItems, createdItems.map((i) => i.id));
}, async (data, { container }) => {
    if (!data?.length) {
        return;
    }
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await inventoryService.delete(data);
});
