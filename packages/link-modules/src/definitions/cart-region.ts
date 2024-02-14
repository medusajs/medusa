import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"

export const CartRegion: ModuleJoinerConfig = {
  serviceName: LINKS.CartRegion,
  isLink: true,
  databaseConfig: {
    tableName: "cart_region",
    idPrefix: "cart_reg",
  },
  alias: [
    {
      name: ["cart_region", "cart_regions"],
    },
  ],
  primaryKeys: ["id", "cart_id", "region_id"],
  relationships: [
    {
      serviceName: Modules.CART,
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
    },
    {
      serviceName: Modules.REGION,
      primaryKey: "id",
      foreignKey: "region_id",
      alias: "region",
    },
  ],
  extends: [
    {
      serviceName: Modules.CART,
      fieldAlias: {
        region: "region_link.region",
      },
      relationship: {
        serviceName: LINKS.CartRegion,
        primaryKey: "cart_id",
        foreignKey: "id",
        alias: "region_link",
      },
    },
    {
      serviceName: Modules.REGION,
      relationship: {
        serviceName: LINKS.CartRegion,
        primaryKey: "region_id",
        foreignKey: "id",
        alias: "cart_link",
      },
    },
  ],
}
