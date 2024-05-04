"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryLevelRepository = void 0;
const _models_1 = require("../models");
const utils_1 = require("@medusajs/utils");
class InventoryLevelRepository extends (0, utils_1.mikroOrmBaseRepositoryFactory)(_models_1.InventoryLevel) {
    async getReservedQuantity(inventoryItemId, locationIds, context = {}) {
        const manager = super.getActiveManager(context);
        const [result] = (await manager
            .getKnex()({ il: "inventory_level" })
            .sum("reserved_quantity")
            .whereIn("location_id", locationIds)
            .andWhere("inventory_item_id", inventoryItemId));
        return parseInt(result.sum);
    }
    async getAvailableQuantity(inventoryItemId, locationIds, context = {}) {
        const knex = super.getActiveManager(context).getKnex();
        const [result] = (await knex({
            il: "inventory_level",
        })
            .sum({
            stocked_quantity: "stocked_quantity",
            reserved_quantity: "reserved_quantity",
        })
            .whereIn("location_id", locationIds)
            .andWhere("inventory_item_id", inventoryItemId));
        return (parseInt(result.stocked_quantity) - parseInt(result.reserved_quantity));
    }
    async getStockedQuantity(inventoryItemId, locationIds, context = {}) {
        const knex = super.getActiveManager(context).getKnex();
        const [result] = (await knex({
            il: "inventory_level",
        })
            .sum({
            stocked_quantity: "stocked_quantity",
        })
            .whereIn("location_id", locationIds)
            .andWhere("inventory_item_id", inventoryItemId));
        return parseInt(result.stocked_quantity);
    }
}
exports.InventoryLevelRepository = InventoryLevelRepository;
