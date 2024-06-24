import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

export const LocationFulfillmentSet: ModuleJoinerConfig = {
  serviceName: LINKS.LocationFulfillmentSet,
  isLink: true,
  databaseConfig: {
    tableName: "location_fulfillment_set",
    idPrefix: "locfs",
  },
  alias: [
    {
      name: ["location_fulfillment_set", "location_fulfillment_sets"],
      args: {
        entity: "LinkLocationFulfillmentSet",
      },
    },
  ],
  primaryKeys: ["id", "stock_location_id", "fulfillment_set_id"],
  relationships: [
    {
      serviceName: Modules.STOCK_LOCATION,
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "location",
      args: {
        methodSuffix: "StockLocations",
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      primaryKey: "id",
      foreignKey: "fulfillment_set_id",
      alias: "fulfillment_set",
      args: {
        methodSuffix: "FulfillmentSets",
      },
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.STOCK_LOCATION,
      relationship: {
        serviceName: LINKS.LocationFulfillmentSet,
        primaryKey: "stock_location_id",
        foreignKey: "id",
        alias: "fulfillment_set_link",
        isList: true,
      },
      fieldAlias: {
        fulfillment_sets: "fulfillment_set_link.fulfillment_set",
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      fieldAlias: {
        location: "locations_link.location",
      },
      relationship: {
        serviceName: LINKS.LocationFulfillmentSet,
        primaryKey: "fulfillment_set_id",
        foreignKey: "id",
        alias: "locations_link",
      },
    },
  ],
}
