import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

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
      args: {
        entity: "LinkOrderPromotion",
      },
    },
  ],
  primaryKeys: ["id", "order_id", "promotion_id"],
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
      serviceName: Modules.PROMOTION,
      primaryKey: "id",
      foreignKey: "promotion_id",
      alias: "promotion",
      args: {
        methodSuffix: "Promotions",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      fieldAlias: {
        promotion: "promotion_link.promotion",
      },
      relationship: {
        serviceName: LINKS.OrderPromotion,
        primaryKey: "order_id",
        foreignKey: "id",
        alias: "promotion_link",
      },
    },
    {
      serviceName: Modules.PROMOTION,
      relationship: {
        serviceName: LINKS.OrderPromotion,
        primaryKey: "promotion_id",
        foreignKey: "id",
        alias: "order_link",
      },
    },
  ],
}
