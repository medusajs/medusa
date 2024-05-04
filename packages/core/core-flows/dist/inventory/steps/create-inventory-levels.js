"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryLevelsStep = exports.createInventoryLevelsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createInventoryLevelsStepId = "create-inventory-levels";
exports.createInventoryLevelsStep = (0, workflows_sdk_1.createStep)(exports.createInventoryLevelsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const inventoryLevels = await service.createInventoryLevels(data);
    return new workflows_sdk_1.StepResponse(inventoryLevels, inventoryLevels.map((level) => level.id));
}, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.deleteInventoryLevels(ids);
});
