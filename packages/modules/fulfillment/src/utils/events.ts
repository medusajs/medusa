import {
  Fulfillment,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
} from "@models"
import { Context } from "@medusajs/framework/types"
import {
  CommonEvents,
  FulfillmentEvents,
  moduleEventBuilderFactory,
  Modules,
} from "@medusajs/framework/utils"

export const eventBuilders = {
  createdFulfillment: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment",
    eventName: FulfillmentEvents.FULFILLMENT_CREATED,
  }),
  updatedFulfillment: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment",
    eventName: FulfillmentEvents.FULFILLMENT_UPDATED,
  }),
  createdFulfillmentAddress: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_address",
    eventName: FulfillmentEvents.FULFILLMENT_ADDRESS_CREATED,
  }),
  createdFulfillmentItem: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_item",
    eventName: FulfillmentEvents.FULFILLMENT_ITEM_CREATED,
  }),
  createdFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_label",
    eventName: FulfillmentEvents.FULFILLMENT_LABEL_CREATED,
  }),
  updatedFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_label",
    eventName: FulfillmentEvents.FULFILLMENT_LABEL_UPDATED,
  }),
  deletedFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_label",
    eventName: FulfillmentEvents.FULFILLMENT_LABEL_DELETED,
  }),
  createdShippingProfile: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_profile",
    eventName: FulfillmentEvents.SHIPPING_PROFILE_CREATED,
  }),
  createdShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_type",
    eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_CREATED,
  }),
  updatedShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_type",
    eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_UPDATED,
  }),
  deletedShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_type",
    eventName: FulfillmentEvents.SHIPPING_OPTION_TYPE_DELETED,
  }),
  createdShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_rule",
    eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED,
  }),
  updatedShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_rule",
    eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_UPDATED,
  }),
  deletedShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_rule",
    eventName: FulfillmentEvents.SHIPPING_OPTION_RULE_DELETED,
  }),
  createdShippingOption: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option",
    eventName: FulfillmentEvents.SHIPPING_OPTION_CREATED,
  }),
  updatedShippingOption: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option",
    eventName: FulfillmentEvents.SHIPPING_OPTION_UPDATED,
  }),
  createdFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_set",
    eventName: FulfillmentEvents.FULFILLMENT_SET_CREATED,
  }),
  updatedFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_set",
    eventName: FulfillmentEvents.FULFILLMENT_SET_UPDATED,
  }),
  deletedFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_set",
    eventName: FulfillmentEvents.FULFILLMENT_SET_DELETED,
  }),
  createdServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "service_zone",
    eventName: FulfillmentEvents.SERVICE_ZONE_CREATED,
  }),
  updatedServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "service_zone",
    eventName: FulfillmentEvents.SERVICE_ZONE_UPDATED,
  }),
  deletedServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "service_zone",
    eventName: FulfillmentEvents.SERVICE_ZONE_DELETED,
  }),
  createdGeoZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "geo_zone",
    eventName: FulfillmentEvents.GEO_ZONE_CREATED,
  }),
  updatedGeoZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "geo_zone",
    eventName: FulfillmentEvents.GEO_ZONE_UPDATED,
  }),
  deletedGeoZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "geo_zone",
    eventName: FulfillmentEvents.GEO_ZONE_DELETED,
  }),
}

export function buildCreatedFulfillmentEvents({
  fulfillments,
  sharedContext,
}: {
  fulfillments: Fulfillment[]
  sharedContext: Context
}) {
  if (!fulfillments.length) {
    return
  }

  const fulfillments_: { id: string }[] = []
  const addresses: { id: string }[] = []
  const items: { id: string }[] = []
  const labels: { id: string }[] = []

  fulfillments.forEach((fulfillment) => {
    fulfillments_.push({ id: fulfillment.id })

    if (fulfillment.delivery_address) {
      addresses.push({ id: fulfillment.delivery_address.id })
    }

    if (fulfillment.items) {
      items.push(...fulfillment.items)
    }

    if (fulfillment.labels) {
      labels.push(...fulfillment.labels)
    }
  })

  eventBuilders.createdFulfillment({ data: fulfillments_, sharedContext })
  eventBuilders.createdFulfillmentAddress({ data: addresses, sharedContext })
  eventBuilders.createdFulfillmentItem({ data: items, sharedContext })
  eventBuilders.createdFulfillmentLabel({ data: labels, sharedContext })
}

export function buildCreatedShippingOptionEvents({
  shippingOptions,
  sharedContext,
}: {
  shippingOptions: ShippingOption[]
  sharedContext: Context
}) {
  if (!shippingOptions.length) {
    return
  }

  const options: { id: string }[] = []
  const types: ShippingOptionType[] = []
  const rules: ShippingOptionRule[] = []

  shippingOptions.forEach((shippingOption) => {
    options.push({ id: shippingOption.id })

    if (shippingOption.type) {
      types.push(shippingOption.type)
    }

    if (shippingOption.rules) {
      rules.push(...shippingOption.rules)
    }
  })

  eventBuilders.createdShippingOption({ data: options, sharedContext })
  eventBuilders.createdShippingOptionType({ data: types, sharedContext })
  eventBuilders.createdShippingOptionRule({ data: rules, sharedContext })
}

export function buildCreatedFulfillmentSetEvents({
  fulfillmentSets,
  sharedContext,
}: {
  fulfillmentSets: FulfillmentSet[]
  sharedContext: Context
}): void {
  if (!fulfillmentSets.length) {
    return
  }

  const serviceZones: ServiceZone[] = []

  fulfillmentSets.forEach((fulfillmentSet) => {
    if (!fulfillmentSet.service_zones?.length) {
      return
    }

    serviceZones.push(...fulfillmentSet.service_zones)
  })

  eventBuilders.createdFulfillmentSet({ data: fulfillmentSets, sharedContext })

  buildCreatedServiceZoneEvents({ serviceZones, sharedContext })
}

export function buildCreatedServiceZoneEvents({
  serviceZones,
  sharedContext,
}: {
  serviceZones: ServiceZone[]
  sharedContext: Context
}): void {
  if (!serviceZones.length) {
    return
  }

  const geoZones: GeoZone[] = []

  serviceZones.forEach((serviceZone) => {
    if (!serviceZone.geo_zones.length) {
      return
    }

    geoZones.push(...serviceZone.geo_zones)
  })

  eventBuilders.createdServiceZone({ data: serviceZones, sharedContext })
  eventBuilders.createdGeoZone({ data: geoZones, sharedContext })
}
