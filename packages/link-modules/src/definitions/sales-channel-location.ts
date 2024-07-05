import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const SalesChannelLocation: ModuleJoinerConfig = {
  serviceName: LINKS.SalesChannelLocation,
  isLink: true,
  databaseConfig: {
    tableName: "sales_channel_stock_location",
    idPrefix: "scloc",
  },
  alias: [
    {
      name: ["sales_channel_location", "sales_channel_locations"],
      args: {
        entity: "LinkSalesChannelLocation",
      },
    },
  ],
  primaryKeys: ["id", "sales_channel_id", "stock_location_id"],
  relationships: [
    {
      serviceName: Modules.SALES_CHANNEL,
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
    },
    {
      serviceName: Modules.STOCK_LOCATION,
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "location",
    },
  ],
  extends: [
    {
      serviceName: Modules.SALES_CHANNEL,
      fieldAlias: {
        stock_locations: "locations_link.location",
      },
      relationship: {
        serviceName: LINKS.SalesChannelLocation,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "locations_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.STOCK_LOCATION,
      fieldAlias: {
        sales_channels: "sales_channels_link.sales_channel",
      },
      relationship: {
        serviceName: LINKS.SalesChannelLocation,
        primaryKey: "stock_location_id",
        foreignKey: "id",
        alias: "sales_channels_link",
        isList: true,
      },
    },
  ],
}
