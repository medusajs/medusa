import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

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
      args: {
        methodSuffix: "Orders",
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      primaryKey: "id",
      foreignKey: "fulfillment_id",
      alias: "fulfillments",
      args: {
        // TODO: We are not suppose to know the module implementation here, wait for later to think about inferring it
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
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "fulfillment_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
