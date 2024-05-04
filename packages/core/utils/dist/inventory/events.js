"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryEvents = void 0;
var event_bus_1 = require("../event-bus");
exports.InventoryEvents = {
    created: "inventory-item." + event_bus_1.CommonEvents.CREATED,
    updated: "inventory-item." + event_bus_1.CommonEvents.UPDATED,
    deleted: "inventory-item." + event_bus_1.CommonEvents.DELETED,
    restored: "inventory-item." + event_bus_1.CommonEvents.RESTORED,
    reservation_item_created: "reservation-item." + event_bus_1.CommonEvents.CREATED,
    reservation_item_updated: "reservation-item." + event_bus_1.CommonEvents.UPDATED,
    reservation_item_deleted: "reservation-item." + event_bus_1.CommonEvents.DELETED,
    inventory_level_deleted: "inventory-level." + event_bus_1.CommonEvents.DELETED,
    inventory_level_created: "inventory-level." + event_bus_1.CommonEvents.CREATED,
    inventory_level_updated: "inventory-level." + event_bus_1.CommonEvents.UPDATED,
};
//# sourceMappingURL=events.js.map