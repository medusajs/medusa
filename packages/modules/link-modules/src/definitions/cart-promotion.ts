import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { LINKS, Modules } from "@medusajs/framework/utils"

export const CartPromotion: ModuleJoinerConfig = {
  serviceName: LINKS.CartPromotion,
  isLink: true,
  databaseConfig: {
    tableName: "cart_promotion",
    idPrefix: "cartpromo",
  },
  alias: [
    {
      name: ["cart_promotion", "cart_promotions"],
      entity: "LinkCartPromotion",
    },
  ],
  primaryKeys: ["id", "cart_id", "promotion_id"],
  relationships: [
    {
      serviceName: Modules.CART,
      entity: "Cart",
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
      args: {
        methodSuffix: "Carts",
      },
    },
    {
      serviceName: Modules.PROMOTION,
      entity: "Promotion",
      primaryKey: "id",
      foreignKey: "promotion_id",
      alias: "promotions",
      args: {
        methodSuffix: "Promotions",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.CART,
      fieldAlias: {
        promotions: {
          path: "cart_link.promotions",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.CartPromotion,
        primaryKey: "cart_id",
        foreignKey: "id",
        alias: "cart_link",
        isList: true,
      },
    },
  ],
}
