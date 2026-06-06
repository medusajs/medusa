import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

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
      entity: "LinkOrderExchangePaymentCollection",
    },
  ],
  primaryKeys: ["id", "exchange_id", "payment_collection_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      entity: "OrderExchange",
      primaryKey: "id",
      foreignKey: "exchange_id",
      alias: "order",
      args: {
        methodSuffix: "OrderExchanges",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      entity: "PaymentCollection",
      primaryKey: "id",
      foreignKey: "payment_collection_id",
      alias: "payment_collection",
      args: {
        methodSuffix: "PaymentCollections",
      },
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      entity: "OrderExchange",
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
      entity: "PaymentCollection",
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
