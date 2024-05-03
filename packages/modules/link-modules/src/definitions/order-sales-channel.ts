import { ModuleJoinerConfig } from "@medusajs/types"

import { Modules } from "@medusajs/modules-sdk"
import { LINKS } from "@medusajs/utils"

export const OrderSalesChannel: ModuleJoinerConfig = {
  serviceName: LINKS.OrderSalesChannel,
  isLink: true,
  databaseConfig: {
    tableName: "order_sales_channel",
    idPrefix: "ordersc",
  },
  alias: [
    {
      name: "order_sales_channel",
    },
    {
      name: "order_sales_channels",
    },
  ],
  primaryKeys: ["id", "order_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      primaryKey: "id",
      foreignKey: "order_id",
      alias: "order",
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        sales_channel: "sales_channel_link.sales_channel",
      },
      relationship: {
        serviceName: LINKS.OrderSalesChannel,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "sales_channel_link",
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      fieldAlias: {
        orders: "order_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderSalesChannel,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "order_link",
        isList: true,
      },
    },
  ],
}
