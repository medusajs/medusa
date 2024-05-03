import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const CartProduct: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.PRODUCT,
        primaryKey: "id",
        foreignKey: "items.product_id",
        alias: "product",
      },
    },
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.PRODUCT,
        primaryKey: "id",
        foreignKey: "items.variant_id",
        alias: "variant",
        args: {
          methodSuffix: "Variants",
        },
      },
    },
    // TODO: Add 'carts' to product modules
  ],
}
