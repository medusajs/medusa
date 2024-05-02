import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const FulfillmentSetLocation: ModuleJoinerConfig = {
  serviceName: LINKS.FulfillmentSetLocation,
  isLink: true,
  databaseConfig: {
    tableName: "fulfillment_set_location",
    idPrefix: "fsloc",
  },
  alias: [
    {
      name: ["fulfillment_set_location", "fulfillment_set_locations"],
      args: {
        entity: "LinkFulfillmentSetLocation",
      },
    },
  ],
  primaryKeys: ["id", "fulfillment_set_id", "stock_location_id"],
  relationships: [
    {
      serviceName: Modules.FULFILLMENT,
      primaryKey: "id",
      foreignKey: "fulfillment_set_id",
      alias: "fulfillment_set",
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
      serviceName: Modules.FULFILLMENT,
      fieldAlias: {
        stock_locations: "locations_link.location",
      },
      relationship: {
        serviceName: LINKS.FulfillmentSetLocation,
        primaryKey: "fulfillment_set_id",
        foreignKey: "id",
        alias: "locations_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.STOCK_LOCATION,
      relationship: {
        serviceName: LINKS.FulfillmentSetLocation,
        primaryKey: "stock_location_id",
        foreignKey: "id",
        alias: "fulfillment_set_link",
        isList: true,
      },
      fieldAlias: {
        fulfillment_sets: "fulfillment_set_link.fulfillment_set",
      },
    },
  ],
}
