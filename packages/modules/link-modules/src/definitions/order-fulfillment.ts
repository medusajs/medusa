import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

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
      args: {
        entity: "LinkOrderFulfillment",
      },
    },
  ],
  primaryKeys: ["id", "order_id", "fulfillment_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      primaryKey: "id",
      foreignKey: "order_id",
      alias: "order",
    },
    {
      serviceName: Modules.FULFILLMENT,
      primaryKey: "id",
      foreignKey: "fulfillment_id",
      alias: "fulfillment",
      args: {
        methodSuffix: "Fulfillments",
      },
      isList: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        fulfillments: "fulfillment_link.fulfillment",
      },
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "fulfillment_link",
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "fulfillment_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
