import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

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
        args: {
          methodSuffix: "Regions",
        },
      },
    },
    {
      serviceName: Modules.REGION,
      relationship: {
        serviceName: Modules.CART,
        primaryKey: "region_id",
        foreignKey: "id",
        alias: "carts",
        args: {
          methodSuffix: "Carts",
        },
        isList: true,
      },
    },
  ],
}
