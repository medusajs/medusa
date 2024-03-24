import { CommonEvents } from "../event-bus"

export const InventoryEvents = {
  created: "inventory-item." + CommonEvents.CREATED,
  updated: "inventory-item." + CommonEvents.UPDATED,
  deleted: "inventory-item." + CommonEvents.DELETED,
  restored: "inventory-item." + CommonEvents.RESTORED,
  reservation_item_created: "reservation-item." + CommonEvents.CREATED,
  reservation_item_updated: "reservation-item." + CommonEvents.UPDATED,
  reservation_item_deleted: "reservation-item." + CommonEvents.DELETED,
  inventory_level_deleted: "inventory-level." + CommonEvents.DELETED,
  inventory_level_created: "inventory-level." + CommonEvents.CREATED,
  inventory_level_updated: "inventory-level." + CommonEvents.UPDATED,
}
