"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryItemsStep = exports.updateInventoryItemsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.updateInventoryItemsStepId = "update-inventory-items-step";
exports.updateInventoryItemsStep = (0, workflows_sdk_1.createStep)(exports.updateInventoryItemsStepId, async (input, { container }) => {
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(input);
    const dataBeforeUpdate = await inventoryService.list({ id: input.map(({ id }) => id) }, {});
    const updatedInventoryItems = await inventoryService.update(input);
    return new workflows_sdk_1.StepResponse(updatedInventoryItems, {
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
    await inventoryService.update(dataBeforeUpdate.map((data) => (0, utils_1.convertItemResponseToUpdateRequest)(data, selects, relations)));
});
