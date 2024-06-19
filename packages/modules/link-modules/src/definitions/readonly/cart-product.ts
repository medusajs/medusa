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
        args: {
          methodSuffix: "Products",
        },
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
          methodSuffix: "ProductVariants",
        },
      },
    },
    {
      serviceName: Modules.PRODUCT,
      relationship: {
        serviceName: Modules.CART,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "cart_items",
        isList: true,
        args: {
          methodSuffix: "LineItems",
        },
      },
    },
  ],
}
