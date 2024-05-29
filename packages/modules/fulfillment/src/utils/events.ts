import {
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
} from "@models"
import { Context, EventBusTypes } from "@medusajs/types"
import { CommonEvents, FulfillmentUtils, Modules } from "@medusajs/utils"

export function buildShippingOptionTypeEvents({
  action,
  shippingOptionTypes,
  sharedContext,
}: {
  action: string
  shippingOptionTypes: ShippingOptionType[]
  sharedContext: Context
}) {
  if (!shippingOptionTypes.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  shippingOptionTypes.forEach((shippingOptionType) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: CommonEvents.CREATED,
      context: sharedContext,
      data: { id: shippingOptionType.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`shipping_option_type_${action}`],
      object: "shipping_option_type",
    })
  })

  aggregator.saveRawMessageData(messages)
}

export function buildShippingOptionRuleEvents({
  action,
  shippingOptionRules,
  sharedContext,
}: {
  action: string
  shippingOptionRules: ShippingOptionRule[]
  sharedContext: Context
}) {
  if (!shippingOptionRules.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  shippingOptionRules.forEach((shippingOptionType) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: CommonEvents.CREATED,
      context: sharedContext,
      data: { id: shippingOptionType.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`shipping_option_rule_${action}`],
      object: "shipping_option_rule",
    })
  })

  aggregator.saveRawMessageData(messages)
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

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  let types: ShippingOptionType[] = []
  let rules: ShippingOptionRule[] = []

  shippingOptions.forEach((shippingOption) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: CommonEvents.CREATED,
      context: sharedContext,
      data: { id: shippingOption.id },
      eventName: FulfillmentUtils.FulfillmentEvents.shipping_option_created,
      object: "shipping_option",
    })

    if (shippingOption.type) {
      types.push(shippingOption.type)
    }

    if (shippingOption.rules) {
      rules.push(...shippingOption.rules)
    }
  })

  aggregator.saveRawMessageData(messages)

  buildShippingOptionTypeEvents({
    action: CommonEvents.CREATED,
    shippingOptionTypes: types,
    sharedContext,
  })

  buildShippingOptionRuleEvents({
    action: CommonEvents.CREATED,
    shippingOptionRules: rules,
    sharedContext,
  })
}

export function buildFulfillmentSetEvents({
  action,
  fulfillmentSets,
  sharedContext,
}: {
  action: string
  fulfillmentSets: FulfillmentSet[]
  sharedContext: Context
}) {
  if (!fulfillmentSets.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  fulfillmentSets.forEach((fulfillmentSet) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: action,
      context: sharedContext,
      data: { id: fulfillmentSet.id },
      eventName: FulfillmentUtils.FulfillmentEvents[action],
      object: "fulfillment_set",
    })
  })

  aggregator.saveRawMessageData(messages)
}

export function buildServiceZoneEvents({
  action,
  serviceZones,
  sharedContext,
}: {
  action: string
  serviceZones: { id: string }[]
  sharedContext: Context
}) {
  if (!serviceZones.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  serviceZones.forEach((serviceZone) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: action,
      context: sharedContext,
      data: { id: serviceZone.id },
      eventName: FulfillmentUtils.FulfillmentEvents[`service_zone_${action}`],
      object: "service_zone",
    })
  })

  aggregator.saveRawMessageData(messages)
}

export function buildGeoZoneEvents({
  action,
  geoZones,
  sharedContext,
}: {
  action: string
  geoZones: { id: string }[]
  sharedContext: Context
}) {
  if (!geoZones.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  geoZones.forEach((geoZone) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: action,
      context: sharedContext,
      data: { id: geoZone.id },
      eventName: FulfillmentUtils.FulfillmentEvents[`geo_zone_${action}`],
      object: "geo_zone",
    })
  })

  aggregator.saveRawMessageData(messages)
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

  buildFulfillmentSetEvents({
    action: CommonEvents.CREATED,
    fulfillmentSets,
    sharedContext,
  })

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

  buildServiceZoneEvents({
    action: CommonEvents.CREATED,
    serviceZones,
    sharedContext,
  })

  buildGeoZoneEvents({
    action: CommonEvents.CREATED,
    geoZones,
    sharedContext,
  })
}
