import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.INVENTORY, {
  schema,
  alias: [
    {
      name: ["inventory_items", "inventory_item", "inventory"],
      entity: "InventoryItem",
      args: {
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
      entity: "ReservationItem",
      args: {
        methodSuffix: "ReservationItems",
      },
    },
  ],
})
