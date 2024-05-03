import { ModuleJoinerConfig } from "@medusajs/types"

import { Modules } from "@medusajs/modules-sdk"

export const OrderSalesChannel: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.SALES_CHANNEL,
        primaryKey: "id",
        foreignKey: "sales_channel_id",
        alias: "sales_channel",
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "orders",
        isList: true,
      },
    },
  ],
}
