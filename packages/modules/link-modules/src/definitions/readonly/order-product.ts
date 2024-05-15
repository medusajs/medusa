import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const OrderProduct: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.PRODUCT,
        primaryKey: "id",
        foreignKey: "items.product_id",
        alias: "product",
      },
    },
    {
      serviceName: Modules.ORDER,
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
    {
      serviceName: Modules.PRODUCT,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "order_items",
        isList: true,
        args: {
          methodSuffix: "LineItems",
        },
      },
    },
  ],
}
