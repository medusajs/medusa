"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const inventory_level_1 = require("../models/inventory-level");
class InventoryLevelService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(inventory_level_1.InventoryLevel) {
    constructor(container) {
        super(container);
        this.inventoryLevelRepository = container.inventoryLevelRepository;
    }
    async retrieveStockedQuantity(inventoryItemId, locationIds, context = {}) {
        const locationIdArray = Array.isArray(locationIds)
            ? locationIds
            : [locationIds];
        return await this.inventoryLevelRepository.getStockedQuantity(inventoryItemId, locationIdArray, context);
    }
    async getAvailableQuantity(inventoryItemId, locationIds, context = {}) {
        const locationIdArray = Array.isArray(locationIds)
            ? locationIds
            : [locationIds];
        return await this.inventoryLevelRepository.getAvailableQuantity(inventoryItemId, locationIdArray, context);
    }
    async getReservedQuantity(inventoryItemId, locationIds, context = {}) {
        if (!Array.isArray(locationIds)) {
            locationIds = [locationIds];
        }
        return await this.inventoryLevelRepository.getReservedQuantity(inventoryItemId, locationIds, context);
    }
}
exports.default = InventoryLevelService;
