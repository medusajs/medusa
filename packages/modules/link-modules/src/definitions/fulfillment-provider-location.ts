import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

export const LocationFulfillmentProvider: ModuleJoinerConfig = {
  serviceName: LINKS.LocationFulfillmentProvider,
  isLink: true,
  databaseConfig: {
    tableName: "location_fulfillment_provider",
    idPrefix: "locfp",
  },
  alias: [
    {
      name: ["location_fulfillment_provider", "location_fulfillment_providers"],
      args: { entity: "LinkLocationFulfillmentProvider" },
    },
  ],
  primaryKeys: ["id", "stock_location_id", "fulfillment_provider_id"],
  relationships: [
    {
      serviceName: Modules.STOCK_LOCATION,
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "location",
      args: { methodSuffix: "StockLocations" },
    },
    {
      serviceName: Modules.FULFILLMENT,
      primaryKey: "id",
      foreignKey: "fulfillment_provider_id",
      alias: "fulfillment_provider",
      args: { methodSuffix: "FulfillmentProviders" },
    },
  ],
  extends: [
    {
      serviceName: Modules.STOCK_LOCATION,
      relationship: {
        serviceName: LINKS.LocationFulfillmentProvider,
        primaryKey: "stock_location_id",
        foreignKey: "id",
        alias: "fulfillment_provider_link",
        isList: true,
      },
      fieldAlias: {
        fulfillment_providers: {
          path: "fulfillment_provider_link.fulfillment_provider",
          isList: true,
        },
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      relationship: {
        serviceName: LINKS.LocationFulfillmentProvider,
        primaryKey: "fulfillment_provider_id",
        foreignKey: "id",
        alias: "locations_link",
        isList: true,
      },
      fieldAlias: {
        locations: {
          path: "locations_link.location",
          isList: true,
        },
      },
    },
  ],
}
