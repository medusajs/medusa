import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

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
      },
    },
  ],
}
