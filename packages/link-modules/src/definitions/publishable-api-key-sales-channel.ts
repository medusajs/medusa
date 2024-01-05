import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"

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
      serviceName: "publishableApiKeyService",
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "publishable_key_id",
      alias: "publishable_key",
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
      serviceName: "publishableApiKeyService",
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
      serviceName: "salesChannelService",
      relationship: {
        serviceName: LINKS.PublishableApiKeySalesChannel,
        isInternalService: true,
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "publishable_keys_link",
        isList: true,
      },
    },
  ],
}
