import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"
import { Modules } from "@medusajs/modules-sdk"

export const PublishableApiKeySalesChannel: ModuleJoinerConfig = {
  serviceName: LINKS.PublishableApiKeySalesChannel,
  isLink: true,
  databaseConfig: {
    tableName: "publishable_api_key_sales_channel",
    idPrefix: "pksc",
  },
  alias: [
    {
      name: "publishable_api_key_sales_channel",
    },
    {
      name: "publishable_api_key_sales_channels",
    },
  ],
  primaryKeys: ["id", "publishable_key_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: Modules.API_KEY,
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "publishable_key_id",
      alias: "api_key",
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
    },
  ],
  extends: [
    {
      serviceName: Modules.API_KEY,
      fieldAlias: {
        sales_channels: "sales_channels_link.sales_channel",
      },
      relationship: {
        serviceName: LINKS.PublishableApiKeySalesChannel,
        isInternalService: true,
        primaryKey: "publishable_key_id",
        foreignKey: "id",
        alias: "sales_channels_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.SALES_CHANNEL,
      fieldAlias: {
        api_keys: "api_keys_link.api_key",
      },
      relationship: {
        serviceName: LINKS.PublishableApiKeySalesChannel,
        isInternalService: true,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "api_keys_link",
        isList: true,
      },
    },
  ],
}
