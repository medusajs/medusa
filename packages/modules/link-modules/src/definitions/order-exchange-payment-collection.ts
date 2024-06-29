import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

export const OrderExchangePaymentCollection: ModuleJoinerConfig = {
  serviceName: LINKS.OrderExchangePaymentCollection,
  isLink: true,
  databaseConfig: {
    tableName: "order_exchange_payment_collection",
    idPrefix: "excpay",
  },
  alias: [
    {
      name: [
        "order_exchange_payment_collection",
        "order_exchange_payment_collections",
      ],
      args: {
        entity: "LinkOrderExchangePaymentCollection",
      },
    },
  ],
  primaryKeys: ["id", "exchange_id", "payment_collection_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      primaryKey: "id",
      foreignKey: "exchange_id",
      alias: "order",
      args: {
        methodSuffix: "OrderExchanges",
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
        exchange_payment_collections: {
          path: "exchange_payment_collections_link.payment_collection",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderExchangePaymentCollection,
        primaryKey: "exchange_id",
        foreignKey: "id",
        alias: "exchange_payment_collections_link",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      fieldAlias: {
        exchange: "order_exchange_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderExchangePaymentCollection,
        primaryKey: "payment_collection_id",
        foreignKey: "id",
        alias: "order_exchange_link",
      },
    },
  ],
}
