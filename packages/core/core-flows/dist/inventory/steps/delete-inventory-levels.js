"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryLevelsStep = exports.deleteInventoryLevelsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.deleteInventoryLevelsStepId = "delete-inventory-levels-step";
exports.deleteInventoryLevelsStep = (0, workflows_sdk_1.createStep)(exports.deleteInventoryLevelsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.softDeleteInventoryLevels(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevLevelIds, { container }) => {
    if (!prevLevelIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.restoreInventoryLevels(prevLevelIds);
});
