import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const OrderFulfillment: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.FULFILLMENT,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "id",
        foreignKey: "order_id",
        alias: "order",
      },
    },
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.FULFILLMENT,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "fulfillments",
        args: {
          methodSuffix: "Fulfillments",
        },
        isList: true,
      },
    },
  ],
}
