import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import {
  Fulfillment,
  FulfillmentProvider,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingProfile,
} from "@models"

export const LinkableKeys: Record<string, string> = {
  fulfillment_id: Fulfillment.name,
  fulfillment_set_id: FulfillmentSet.name,
  shipping_option_id: ShippingOption.name,
  shipping_option_rule_id: ShippingOptionRule.name,
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

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.FULFILLMENT,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["fulfillment_set", "fulfillment_sets"],
      args: {
        entity: FulfillmentSet.name,
      },
    },
    {
      name: ["shipping_option", "shipping_options"],
      args: {
        entity: ShippingOption.name,
        methodSuffix: "ShippingOptions",
      },
    },
    {
      name: ["shipping_profile", "shipping_profiles"],
      args: {
        entity: ShippingProfile.name,
        methodSuffix: "ShippingProfiles",
      },
    },
    {
      name: ["fulfillment", "fulfillments"],
      args: {
        entity: Fulfillment.name,
        methodSuffix: "Fulfillments",
      },
    },
    {
      name: ["fulfillment_provider", "fulfillment_providers"],
      args: {
        entity: FulfillmentProvider.name,
        methodSuffix: "FulfillmentProviders",
      },
    },
    {
      name: ["service_zone", "service_zones"],
      args: {
        entity: ServiceZone.name,
        methodSuffix: "ServiceZones",
      },
    },
    {
      name: ["geo_zone", "geo_zones"],
      args: {
        entity: GeoZone.name,
        methodSuffix: "GeoZones",
      },
    },
    {
      name: ["shipping_option_rule", "shipping_option_rules"],
      args: {
        entity: ShippingOptionRule.name,
        methodSuffix: "ShippingOptionRules",
      },
    },
  ],
} as ModuleJoinerConfig
