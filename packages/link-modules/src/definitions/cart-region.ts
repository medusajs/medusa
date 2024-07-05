import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const CartRegion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.REGION,
        primaryKey: "id",
        foreignKey: "region_id",
        alias: "region",
      },
    },
    {
      serviceName: Modules.REGION,
      relationship: {
        serviceName: Modules.CART,
        primaryKey: "region_id",
        foreignKey: "id",
        alias: "carts",
        isList: true,
      },
    },
  ],
}
