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
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillment: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentAddress: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_address",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentItem: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_item",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  deletedFulfillmentLabel: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_label",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingProfile: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_profile",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  deletedShippingOptionType: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_type",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  deletedShippingOptionRule: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "shipping_option_rule",
    eventsEnum: FulfillmentEvents,
  }),
  createdShippingOption: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "shipping_option",
    eventsEnum: FulfillmentEvents,
  }),
  updatedShippingOption: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "shipping_option",
    eventsEnum: FulfillmentEvents,
  }),
  createdFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "fulfillment_set",
    eventsEnum: FulfillmentEvents,
  }),
  updatedFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "fulfillment_set",
    eventsEnum: FulfillmentEvents,
  }),
  deletedFulfillmentSet: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "fulfillment_set",
    eventsEnum: FulfillmentEvents,
  }),
  createdServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  updatedServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  deletedServiceZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.DELETED,
    object: "service_zone",
    eventsEnum: FulfillmentEvents,
  }),
  createdGeoZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.CREATED,
    object: "geo_zone",
    eventsEnum: FulfillmentEvents,
  }),
  updatedGeoZone: moduleEventBuilderFactory({
    source: Modules.FULFILLMENT,
    action: CommonEvents.UPDATED,
    object: "geo_zone",
    eventsEnum: FulfillmentEvents,
  }),
  deletedGeoZone: moduleEventBuilderFactory({
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
