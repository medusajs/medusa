import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "cartService",
  primaryKeys: ["id"],
  linkableKeys: { cart_id: "Cart" },
  alias: [
    {
      name: "cart",
    },
  ],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
      args: {
        methodSuffix: "Variants",
      },
    },
    {
      serviceName: "regionService",
      primaryKey: "id",
      foreignKey: "region_id",
      alias: "region",
    },
    {
      serviceName: "customerService",
      primaryKey: "id",
      foreignKey: "customer_id",
      alias: "customer",
    },
  ],
} as ModuleJoinerConfig
