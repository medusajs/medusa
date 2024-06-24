import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

export const CartSalesChannel: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.SALES_CHANNEL,
        primaryKey: "id",
        foreignKey: "sales_channel_id",
        alias: "sales_channel",
        args: {
          methodSuffix: "SalesChannels",
        },
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      relationship: {
        serviceName: Modules.CART,
        primaryKey: "sales_channel_id",
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
