import {
  Fulfillment,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
} from "@models"
import { Context } from "@medusajs/types"
import {
  CommonEvents,
  eventBuilderFactory,
  FulfillmentEvents,
  Modules,
} from "@medusajs/utils"

export const eventBuilders = {
  createdFulfillment: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment",
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillment: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentAddress: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_address",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentItem: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_item",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentLabel: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillmentLabel: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  deletedFulfillmentLabel: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingProfile: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_profile",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOptionType: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOptionType: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  deletedShippingOptionType: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOptionRule: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOptionRule: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  deletedShippingOptionRule: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOption: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOption: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentSet: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_set",
    isMainEntity: true,
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillmentSet: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_set",
    isMainEntity: true,
    eventsEnum: FulfillmentEvents,
  }),
  deletedFulfillmentSet: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_set",
    isMainEntity: true,
    eventsEnum: FulfillmentEvents,
  }),
  createdServiceZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  updatedServiceZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  deletedServiceZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  createdGeoZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "geo_zone",
    eventsEnum: FulfillmentEvents,
  }),
  updatedGeoZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "geo_zone",
    eventsEnum: FulfillmentEvents,
  }),
  deletedGeoZone: eventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "geo_zone",
    eventsEnum: FulfillmentEvents,
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
