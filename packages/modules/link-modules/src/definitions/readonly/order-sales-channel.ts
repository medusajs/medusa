import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const OrderSalesChannel: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.SALES_CHANNEL,
        entity: "SalesChannel",
        primaryKey: "id",
        foreignKey: "sales_channel_id",
        alias: "sales_channel",
        args: {
          methodSuffix: "SalesChannels",
        },
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      relationship: {
        serviceName: Modules.ORDER,
        entity: "Order",
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "orders",
        args: {
          methodSuffix: "Orders",
        },
        isList: true,
      },
    },
  ],
}
