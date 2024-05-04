"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryLevelsStep = exports.updateInventoryLevelsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.updateInventoryLevelsStepId = "update-inventory-levels-step";
exports.updateInventoryLevelsStep = (0, workflows_sdk_1.createStep)(exports.updateInventoryLevelsStepId, async (input, { container }) => {
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(input);
    const dataBeforeUpdate = await inventoryService.listInventoryLevels({
        $or: input.map(({ inventory_item_id, location_id }) => ({
            inventory_item_id,
            location_id,
        })),
    }, {});
    const updatedLevels = await inventoryService.updateInventoryLevels(input);
    return new workflows_sdk_1.StepResponse(updatedLevels, {
        dataBeforeUpdate,
        selects,
        relations,
    });
}, async (revertInput, { container }) => {
    if (!revertInput?.dataBeforeUpdate?.length) {
        return;
    }
    const { dataBeforeUpdate, selects, relations } = revertInput;
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    await inventoryService.updateInventoryLevels(dataBeforeUpdate.map((data) => (0, utils_1.convertItemResponseToUpdateRequest)(data, selects, relations)));
});
