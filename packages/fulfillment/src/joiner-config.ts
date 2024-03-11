import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import {
  MapToConfig,
  pluralize,
  toCamelCase,
  upperCaseFirst,
} from "@medusajs/utils"
import {
  Fulfillment,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingProfile,
} from "@models"

export const LinkableKeys: Record<string, string> = {
  fulfillment_id: Fulfillment.name,
  fulfillment_set_id: FulfillmentSet.name,
  shipping_option_id: ShippingOption.name,
}

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

const aliases = [
  { name: "fulfillment_set", entityName: FulfillmentSet.name },
  { name: "shipping_option", entityName: ShippingOption.name },
  { name: "shipping_profile", entityName: ShippingProfile.name },
  { name: "fulfillment", entityName: Fulfillment.name },
  { name: "service_zone", entityName: ServiceZone.name },
  { name: "geo_zone", entityName: GeoZone.name },
].map(({ name, entityName }) => ({
  name: [name, pluralize(name)],
  args: {
    entity: entityName,
    methodSuffix: upperCaseFirst(toCamelCase(pluralize(name))),
  },
}))

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.FULFILLMENT,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: aliases,
} as ModuleJoinerConfig
