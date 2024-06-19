import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const ProductSalesChannel: ModuleJoinerConfig = {
  serviceName: LINKS.ProductSalesChannel,
  isLink: true,
  databaseConfig: {
    tableName: "product_sales_channel",
    idPrefix: "prodsc",
  },
  alias: [
    {
      name: "product_sales_channel",
    },
    {
      name: "product_sales_channels",
    },
  ],
  primaryKeys: ["id", "product_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "product",
      args: {
        methodSuffix: "Products",
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
      args: {
        methodSuffix: "SalesChannels",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      fieldAlias: {
        sales_channels: "sales_channels_link.sales_channel",
      },
      relationship: {
        serviceName: LINKS.ProductSalesChannel,
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "sales_channels_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      relationship: {
        serviceName: LINKS.ProductSalesChannel,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "products_link",
        isList: true,
      },
    },
  ],
}
