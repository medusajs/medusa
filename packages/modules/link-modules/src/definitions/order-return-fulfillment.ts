import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { LINKS, Modules } from "@medusajs/framework/utils"

export const ReturnFulfillment: ModuleJoinerConfig = {
  serviceName: LINKS.ReturnFulfillment,
  isLink: true,
  databaseConfig: {
    tableName: "return_fulfillment",
    idPrefix: "retful",
  },
  alias: [
    {
      name: ["return_fulfillment", "return_fulfillments"],
      entity: "LinkReturnFulfillment",
    },
  ],
  primaryKeys: ["id", "return_id", "fulfillment_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      entity: "Order",
      primaryKey: "id",
      foreignKey: "return_id",
      alias: "return",
      args: {
        methodSuffix: "Returns",
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
        return_fulfillments: {
          path: "return_fulfillment_link.fulfillments",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "return_id",
        foreignKey: "id",
        alias: "return_fulfillment_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      relationship: {
        serviceName: LINKS.OrderFulfillment,
        primaryKey: "fulfillment_id",
        foreignKey: "id",
        alias: "return_link",
      },
    },
  ],
}
