import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { LINKS, Modules } from "@medusajs/framework/utils"

export const OrderFulfillment: ModuleJoinerConfig = {
  serviceName: LINKS.OrderFulfillment,
  isLink: true,
  databaseConfig: {
    tableName: "order_fulfillment",
    idPrefix: "ordful",
  },
  alias: [
    {
      name: ["order_fulfillment", "order_fulfillments"],
      entity: "LinkOrderFulfillment",
    },
  ],
  primaryKeys: ["id", "order_id", "fulfillment_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      entity: "Order",
      primaryKey: "id",
      foreignKey: "order_id",
      alias: "order",
      args: {
        methodSuffix: "Orders",
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      entity: "Fulfillment",
      primaryKey: "id",
      foreignKey: "fulfillment_id",
      alias: "fulfillments",
      args: {
        methodSuffix: "Fulfillments",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        fulfillments: {
          path: "fulfillment_link.fulfillments",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "fulfillment_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      fieldAlias: {
        order: "order_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "fulfillment_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
