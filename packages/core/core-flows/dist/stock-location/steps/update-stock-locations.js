"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockLocationsStep = exports.updateStockLocationsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.updateStockLocationsStepId = "update-stock-locations-step";
exports.updateStockLocationsStep = (0, workflows_sdk_1.createStep)(exports.updateStockLocationsStepId, async (input, { container }) => {
    const stockLocationService = container.resolve(modules_sdk_1.ModuleRegistrationName.STOCK_LOCATION);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        input.update,
    ]);
    const dataBeforeUpdate = await stockLocationService.list(input.selector, {
        select: selects,
        relations,
    });
    const updatedStockLocations = await stockLocationService.update(input.selector, input.update);
    return new workflows_sdk_1.StepResponse(updatedStockLocations, dataBeforeUpdate);
}, async (revertInput, { container }) => {
    if (!revertInput?.length) {
        return;
    }
    const stockLocationService = container.resolve(modules_sdk_1.ModuleRegistrationName.STOCK_LOCATION);
    await stockLocationService.upsert(revertInput.map((item) => ({
        id: item.id,
        name: item.name,
        ...(item.metadata ? { metadata: item.metadata } : {}),
        ...(item.address ? { address: item.address } : {}),
    })));
});
