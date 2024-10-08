import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const LineItemAdjustmentPromotion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.PROMOTION,
        entity: "Promotion",
        primaryKey: "id",
        foreignKey: "promotion_id",
        alias: "promotion",
        args: {
          methodSuffix: "Promotions",
        },
      },
    },
  ],
}
