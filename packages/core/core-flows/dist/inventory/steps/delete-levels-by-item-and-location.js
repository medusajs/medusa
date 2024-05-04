"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryLevelsFromItemAndLocationsStep = exports.deleteInventoryLevelsFromItemAndLocationsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
exports.deleteInventoryLevelsFromItemAndLocationsStepId = "delete-inventory-levels-from-item-and-location-step";
exports.deleteInventoryLevelsFromItemAndLocationsStep = (0, workflows_sdk_1.createStep)(exports.deleteInventoryLevelsFromItemAndLocationsStepId, async (input, { container }) => {
    if (!input.length) {
        return new workflows_sdk_1.StepResponse(void 0, []);
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const items = await service.listInventoryLevels({ $or: input }, {});
    if (items.some((i) => i.reserved_quantity > 0)) {
        const invalidDeletes = items.filter((i) => i.reserved_quantity > 0);
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Cannot remove Inventory Levels for ${invalidDeletes
            .map((i) => `Inventory Level ${i.id} at Location ${i.location_id}`)
            .join(", ")} because there are reserved quantities for items at locations`);
    }
    const deletedIds = items.map((i) => i.id);
    const deleted = await service.softDeleteInventoryLevels(deletedIds);
    return new workflows_sdk_1.StepResponse({
        [modules_sdk_1.Modules.INVENTORY]: deleted,
    }, deletedIds);
}, async (prevLevelIds, { container }) => {
    if (!prevLevelIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await service.restoreInventoryLevels(prevLevelIds);
});
