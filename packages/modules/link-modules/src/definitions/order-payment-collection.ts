import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

export const OrderPaymentCollection: ModuleJoinerConfig = {
  serviceName: LINKS.OrderPaymentCollection,
  isLink: true,
  databaseConfig: {
    tableName: "order_payment_collection",
    idPrefix: "capaycol",
  },
  alias: [
    {
      name: ["order_payment_collection", "order_payment_collections"],
      args: {
        entity: "LinkOrderPaymentCollection",
      },
    },
  ],
  primaryKeys: ["id", "order_id", "payment_collection_id"],
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
      serviceName: Modules.PAYMENT,
      primaryKey: "id",
      foreignKey: "payment_collection_id",
      alias: "payment_collection",
      args: {
        methodSuffix: "PaymentCollections",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        payment_collections: {
          path: "payment_collections_link.payment_collection",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderPaymentCollection,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "payment_collections_link",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      fieldAlias: {
        order: "order_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderPaymentCollection,
        primaryKey: "payment_collection_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
