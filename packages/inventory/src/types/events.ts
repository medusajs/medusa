import { CommonEvents } from "@medusajs/utils"

export enum InventoryItemEvents {
  INVENTORY_ITEM_UPDATED = "inventory-item." + CommonEvents.UPDATED,
  INVENTORY_ITEM_CREATED = "inventory-item." + CommonEvents.CREATED,
  INVENTORY_ITEM_DELETED = "inventory-item." + CommonEvents.DELETED,
}

export enum InventoryLevelEvents {
  INVENTORY_LEVEL_UPDATED = "inventory-level." + CommonEvents.UPDATED,
  INVENTORY_LEVEL_CREATED = "inventory-level." + CommonEvents.CREATED,
  INVENTORY_LEVEL_DELETED = "inventory-level." + CommonEvents.DELETED,
}

export enum ReservationItemEvents {
  RESERVATION_ITEM_UPDATED = "reservation-item." + CommonEvents.UPDATED,
  RESERVATION_ITEM_CREATED = "reservation-item." + CommonEvents.CREATED,
  RESERVATION_ITEM_DELETED = "reservation-item." + CommonEvents.DELETED,
}
