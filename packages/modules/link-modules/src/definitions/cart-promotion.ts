import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

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
      args: {
        entity: "LinkCartPromotion",
      },
    },
  ],
  primaryKeys: ["id", "cart_id", "promotion_id"],
  relationships: [
    {
      serviceName: Modules.CART,
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
    },
    {
      serviceName: Modules.PROMOTION,
      primaryKey: "id",
      foreignKey: "promotion_id",
      alias: "promotions",
    },
  ],
  extends: [
    {
      serviceName: Modules.CART,
      fieldAlias: {
        promotions: "cart_link.promotions",
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
