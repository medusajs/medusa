"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const models_1 = require("./models");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const schema_1 = __importDefault(require("./schema"));
exports.LinkableKeys = {
    inventory_item_id: models_1.InventoryItem.name,
    inventory_level_id: models_1.InventoryLevel.name,
    reservation_item_id: models_1.ReservationItem.name,
};
const entityLinkableKeysMap = {};
Object.entries(exports.LinkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ?? (entityLinkableKeysMap[value] = []);
    entityLinkableKeysMap[value].push({
        mapTo: key,
        valueFrom: key.split("_").pop(),
    });
});
exports.entityNameToLinkableKeysMap = entityLinkableKeysMap;
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.INVENTORY,
    primaryKeys: ["id"],
    linkableKeys: {
        inventory_item_id: models_1.InventoryItem.name,
        inventory_level_id: models_1.InventoryLevel.name,
        reservation_item_id: models_1.ReservationItem.name,
    },
    schema: schema_1.default,
    alias: [
        {
            name: ["inventory_items", "inventory_item", "inventory"],
            args: {
                entity: "InventoryItem",
            },
        },
        {
            name: ["inventory_level", "inventory_levels"],
            args: {
                entity: "InventoryLevel",
                methodSuffix: "InventoryLevels",
            },
        },
        {
            name: [
                "reservation",
                "reservations",
                "reservation_item",
                "reservation_items",
            ],
            args: {
                entity: "ReservationItem",
                methodSuffix: "ReservationItems",
            },
        },
    ],
};
