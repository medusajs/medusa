"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStockLocations = exports.createStockLocationsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.createStockLocationsStepId = "create-stock-locations";
exports.createStockLocations = (0, workflows_sdk_1.createStep)(exports.createStockLocationsStepId, async (data, { container }) => {
    const stockLocationService = container.resolve(modules_sdk_1.ModuleRegistrationName.STOCK_LOCATION);
    const created = await stockLocationService.create(data);
    return new workflows_sdk_1.StepResponse(created, created.map((i) => i.id));
}, async (createdStockLocationIds, { container }) => {
    if (!createdStockLocationIds?.length) {
        return;
    }
    const stockLocationService = container.resolve(modules_sdk_1.ModuleRegistrationName.STOCK_LOCATION);
    await stockLocationService.delete(createdStockLocationIds);
});
