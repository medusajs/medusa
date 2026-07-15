import { GraphCatalog } from "../catalog"
import { IRemoteDataFetcher, RemoteExpandProperty } from "../types"

const FULFILLMENT = "fulfillment"
const STOCK_LOCATION = "stock_location"
const LOCATION_FULFILLMENT_SET_LINK =
  "StockLocationStockLocationFulfillmentFulfillmentSetLink"

export const fulfillmentJoinerConfig = {
  serviceName: FULFILLMENT,
  primaryKeys: ["id"],
  alias: [
    {
      name: ["shipping_option", "shipping_options"],
      entity: "ShippingOption",
      args: { methodSuffix: "ShippingOptions" },
    },
    {
      name: ["service_zone", "service_zones"],
      entity: "ServiceZone",
      args: { methodSuffix: "ServiceZones" },
    },
    {
      name: ["fulfillment_set", "fulfillment_sets"],
      entity: "FulfillmentSet",
      args: { methodSuffix: "FulfillmentSets" },
    },
  ],
  relationships: [
    {
      serviceName: FULFILLMENT,
      entity: "ServiceZone",
      primaryKey: "id",
      foreignKey: "service_zone_id",
      alias: "service_zone",
    },
    {
      serviceName: FULFILLMENT,
      entity: "FulfillmentSet",
      primaryKey: "id",
      foreignKey: "fulfillment_set_id",
      alias: "fulfillment_set",
    },
  ],
}

export const stockLocationJoinerConfig = {
  serviceName: STOCK_LOCATION,
  primaryKeys: ["id"],
  alias: [
    {
      name: ["stock_location", "stock_locations"],
      entity: "StockLocation",
      args: { methodSuffix: "StockLocations" },
    },
  ],
  relationships: [],
}

export const locationFulfillmentSetLink = {
  serviceName: LOCATION_FULFILLMENT_SET_LINK,
  isLink: true,
  alias: [
    {
      name: ["location_fulfillment_set", "location_fulfillment_sets"],
      entity: "LinkLocationFulfillmentSet",
    },
  ],
  primaryKeys: ["id", "stock_location_id", "fulfillment_set_id"],
  relationships: [
    {
      serviceName: STOCK_LOCATION,
      entity: "StockLocation",
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "location",
      args: { methodSuffix: "StockLocations" },
    },
    {
      serviceName: FULFILLMENT,
      entity: "FulfillmentSet",
      primaryKey: "id",
      foreignKey: "fulfillment_set_id",
      alias: "fulfillment_set",
      args: { methodSuffix: "FulfillmentSets" },
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: FULFILLMENT,
      entity: "FulfillmentSet",
      fieldAlias: {
        location: "locations_link.location",
      },
      relationship: {
        serviceName: LOCATION_FULFILLMENT_SET_LINK,
        primaryKey: "fulfillment_set_id",
        foreignKey: "id",
        alias: "locations_link",
      },
    },
  ],
}

export const fulfillmentLocationJoinerConfigs = [
  fulfillmentJoinerConfig,
  stockLocationJoinerConfig,
  locationFulfillmentSetLink,
]

const shippingOption = {
  id: "so_1",
  provider_id: "prov_1",
  shipping_profile_id: "sp_1",
  service_zone_id: "sz_1",
}

const serviceZone = {
  id: "sz_1",
  fulfillment_set_id: "fs_1",
}

const fulfillmentSet = {
  id: "fs_1",
}

const locationLink = {
  id: "link_1",
  fulfillment_set_id: "fs_1",
  stock_location_id: "sloc_1",
}

const stockLocation = {
  id: "sloc_1",
}

export const shippingOptionLocationQuery = {
  alias: "shipping_option",
  fields: ["id", "provider_id", "shipping_profile_id"],
  expands: [
    { property: "service_zone", fields: [] },
    { property: "service_zone.fulfillment_set", fields: [] },
    {
      property: "service_zone.fulfillment_set.location",
      fields: ["id"],
    },
  ],
}

export const fulfillmentLocationDataFetcher: IRemoteDataFetcher = {
  fetch: async (expand: RemoteExpandProperty) => {
    const service = expand.serviceConfig.serviceName
    const entity = expand.entity ?? expand.serviceConfig.entity

    if (service === FULFILLMENT && entity === "ShippingOption") {
      const row: Record<string, unknown> = { ...shippingOption }
      if (expand.expands?.service_zone) {
        row.service_zone = { ...serviceZone }
        if (expand.expands.service_zone.expands?.fulfillment_set) {
          ;(row.service_zone as Record<string, unknown>).fulfillment_set = {
            ...fulfillmentSet,
          }
        }
      }
      return { data: [row] }
    }
    if (service === FULFILLMENT && entity === "ServiceZone") {
      return { data: [serviceZone] }
    }
    if (service === FULFILLMENT && entity === "FulfillmentSet") {
      return { data: [fulfillmentSet] }
    }
    if (service === LOCATION_FULFILLMENT_SET_LINK) {
      return { data: [locationLink] }
    }
    if (service === STOCK_LOCATION) {
      return { data: [stockLocation] }
    }

    throw new Error(`Unexpected fetch: service=${service} entity=${entity}`)
  },
}

export function createFulfillmentLocationCatalog(options?: {
  autoCreateServiceNameAlias?: boolean
}) {
  return new GraphCatalog(fulfillmentLocationJoinerConfigs, {
    autoCreateServiceNameAlias: options?.autoCreateServiceNameAlias ?? true,
  })
}
