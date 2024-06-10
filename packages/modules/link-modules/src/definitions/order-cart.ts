import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const OrderCart: ModuleJoinerConfig = {
  serviceName: LINKS.OrderCart,
  isLink: true,
  databaseConfig: {
    tableName: "order_cart",
    idPrefix: "ordercart",
  },
  alias: [
    {
      name: ["order_cart", "order_carts"],
      args: {
        entity: "LinkOrderCart",
      },
    },
  ],
  primaryKeys: ["id", "order_id", "cart_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      primaryKey: "id",
      foreignKey: "order_id",
      alias: "order",
    },
    {
      serviceName: Modules.CART,
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        cart: "cart_link.cart",
      },
      relationship: {
        serviceName: LINKS.OrderCart,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "cart_link",
      },
    },
    {
      serviceName: Modules.CART,
      fieldAlias: {
        order: "order_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderCart,
        primaryKey: "cart_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
