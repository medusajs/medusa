import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

export const CartShippingOption: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      entity: "ShippingMethod",
      relationship: {
        serviceName: Modules.FULFILLMENT,
        primaryKey: "id",
        foreignKey: "shipping_option_id",
        alias: "shipping_option",
        args: {
          methodSuffix: "ShippingOptions",
        },
      },
    },
  ],
}
