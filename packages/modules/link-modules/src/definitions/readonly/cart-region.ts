import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

export const CartRegion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      entity: "Cart",
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
      entity: "Region",
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
