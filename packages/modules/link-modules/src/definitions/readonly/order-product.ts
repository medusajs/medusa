import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const OrderProduct: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.PRODUCT,
        entity: "Product",
        primaryKey: "id",
        foreignKey: "items.product_id",
        alias: "product",
        args: {
          methodSuffix: "Products",
        },
      },
    },
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.PRODUCT,
        entity: "ProductVariant",
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
        serviceName: Modules.ORDER,
        entity: "OrderLineItem",
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "order_items",
        isList: true,
        args: {
          methodSuffix: "OrderLineItems",
        },
      },
    },
  ],
}
