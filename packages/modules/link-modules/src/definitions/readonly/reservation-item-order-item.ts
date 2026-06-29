import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const ReservationItemOrderItem: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.INVENTORY,
      entity: "ReservationItem",
      relationship: {
        serviceName: Modules.ORDER,
        entity: "OrderItem",
        primaryKey: "item_id",
        foreignKey: "line_item_id",
        alias: "order_item",
        args: {
          methodSuffix: "OrderItems",
        },
      },
    },
  ],
}
