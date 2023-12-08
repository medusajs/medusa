import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { InventoryItem, InventoryLevel, ReservationItem } from "./models"

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.INVENTORY,
  primaryKeys: ["id"],
  linkableKeys: {
    inventory_item_id: InventoryItem.name,
    inventory_level_id: InventoryLevel.name,
    reservation_item_id: ReservationItem.name,
  },
  alias: [
    {
      name: "inventory_items",
    },
    {
      name: "inventory",
    },
    {
      name: "inventory_level",
      args: {
        methodSuffix: "InventoryLevels",
      },
    },
    {
      name: "inventory_levels",
      args: {
        methodSuffix: "InventoryLevels",
      },
    },
    {
      name: "reservation_items",
      args: {
        methodSuffix: "ReservationItems",
      },
    },
    {
      name: "reservation_item",
      args: {
        methodSuffix: "ReservationItems",
      },
    },
    {
      name: "reservation",
      args: {
        methodSuffix: "ReservationItems",
      },
    },
    {
      name: "reservations",
      args: {
        methodSuffix: "ReservationItems",
      },
    },
  ],
}
