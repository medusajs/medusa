import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const CartRegion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.REGION,
        entity: "Region",
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
        entity: "Cart",
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
