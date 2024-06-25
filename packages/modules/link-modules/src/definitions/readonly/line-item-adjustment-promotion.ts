import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

export const LineItemAdjustmentPromotion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.PROMOTION,
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
