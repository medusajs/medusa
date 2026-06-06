import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

export const CartSalesChannel: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      entity: "Cart",
      relationship: {
        serviceName: Modules.SALES_CHANNEL,
        entity: "SalesChannel",
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
      entity: "SalesChannel",
      relationship: {
        serviceName: Modules.CART,
        entity: "Cart",
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
