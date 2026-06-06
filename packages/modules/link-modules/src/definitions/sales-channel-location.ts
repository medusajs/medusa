import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

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
      entity: "LinkSalesChannelLocation",
    },
  ],
  primaryKeys: ["id", "sales_channel_id", "stock_location_id"],
  relationships: [
    {
      serviceName: Modules.SALES_CHANNEL,
      entity: "SalesChannel",
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
      args: {
        methodSuffix: "SalesChannels",
      },
      hasMany: true,
    },
    {
      serviceName: Modules.STOCK_LOCATION,
      entity: "StockLocation",
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "location",
      args: {
        methodSuffix: "StockLocations",
      },
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.SALES_CHANNEL,
      entity: "SalesChannel",
      fieldAlias: {
        stock_locations: {
          path: "locations_link.location",
          isList: true,
        },
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
      entity: "StockLocation",
      fieldAlias: {
        sales_channels: {
          path: "sales_channels_link.sales_channel",
          isList: true,
        },
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
