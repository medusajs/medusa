import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const OrderFulfillment: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.FULFILLMENT,
        primaryKey: "id",
        foreignKey: "fulfillment_id",
        alias: "fulfillments",
        isList: true,
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "fulfillment_id",
        foreignKey: "id",
        alias: "order",
      },
    },
  ],
}
