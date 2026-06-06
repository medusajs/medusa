import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

export const OrderPromotion: ModuleJoinerConfig = {
  serviceName: LINKS.OrderPromotion,
  isLink: true,
  databaseConfig: {
    tableName: "order_promotion",
    idPrefix: "orderpromo",
  },
  alias: [
    {
      name: ["order_promotion", "order_promotions"],
      entity: "LinkOrderPromotion",
    },
  ],
  primaryKeys: ["id", "order_id", "promotion_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      entity: "Order",
      primaryKey: "id",
      foreignKey: "order_id",
      alias: "order",
      args: {
        methodSuffix: "Orders",
      },
      hasMany: true,
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
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      entity: "Order",
      fieldAlias: {
        promotions: {
          path: "promotion_link.promotions",
          isList: true,
        },
        /**
         * @deprecated use the promotions field alias instead
         */
        promotion: {
          path: "promotion_link.promotions",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderPromotion,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "promotion_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.PROMOTION,
      entity: "Promotion",
      relationship: {
        serviceName: LINKS.OrderPromotion,
        primaryKey: "promotion_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
