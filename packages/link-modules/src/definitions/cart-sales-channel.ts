import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"

export const CartSalesChannel: ModuleJoinerConfig = {
  serviceName: LINKS.CartSalesChannel,
  isLink: true,
  databaseConfig: {
    tableName: "cart_sales_channel",
    idPrefix: "cartsc",
  },
  alias: [
    {
      name: "cart_sales_channel",
    },
    {
      name: "cart_sales_channels",
    },
  ],
  primaryKeys: ["id", "cart_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: "cartService",
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "cart_id",
      alias: "cart",
    },
    {
      serviceName: "salesChannelService",
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
    },
  ],
  extends: [
    {
      serviceName: "cartService",
      fieldAlias: {
        sales_channel: "sales_channel_link.sales_channel",
      },
      relationship: {
        serviceName: LINKS.CartSalesChannel,
        isInternalService: true,
        primaryKey: "cart_id",
        foreignKey: "id",
        alias: "sales_channel_link",
      },
    },
    {
      serviceName: "salesChannelService",
      fieldAlias: {
        carts: "cart_link.cart",
      },
      relationship: {
        serviceName: LINKS.CartSalesChannel,
        isInternalService: true,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "cart_link",
        isList: true,
      },
    },
  ],
}
