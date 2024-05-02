import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const CartPaymentCollection: ModuleJoinerConfig = {
  serviceName: LINKS.CartPaymentCollection,
  isLink: true,
  databaseConfig: {
    tableName: "cart_payment_collection",
    idPrefix: "capaycol",
  },
  alias: [
    {
      name: ["cart_payment_collection", "cart_payment_collections"],
      args: {
        entity: "LinkCartPaymentCollection",
      },
    },
  ],
  primaryKeys: ["id", "cart_id", "payment_collection_id"],
  relationships: [
    {
      serviceName: Modules.CART,
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
    },
    {
      serviceName: Modules.PAYMENT,
      primaryKey: "id",
      foreignKey: "payment_collection_id",
      alias: "payment_collection",
    },
  ],
  extends: [
    {
      serviceName: Modules.CART,
      fieldAlias: {
        payment_collection: "payment_collection_link.payment_collection",
      },
      relationship: {
        serviceName: LINKS.CartPaymentCollection,
        primaryKey: "cart_id",
        foreignKey: "id",
        alias: "payment_collection_link",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      fieldAlias: {
        cart: "cart_link.cart",
      },
      relationship: {
        serviceName: LINKS.CartPaymentCollection,
        primaryKey: "payment_collection_id",
        foreignKey: "id",
        alias: "cart_link",
      },
    },
  ],
}
