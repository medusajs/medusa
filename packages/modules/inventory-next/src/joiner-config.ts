import { defineJoinerConfig, Modules } from "@medusajs/utils"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.INVENTORY, {
  schema,
  alias: [
    {
      name: ["inventory_items", "inventory_item", "inventory"],
      args: {
        entity: "InventoryItem",
        methodSuffix: "InventoryItems",
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
})
