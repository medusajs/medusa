import {
  Fulfillment,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingOptionType,
  ShippingProfile,
} from "@models"
import { Context, EventBusTypes } from "@medusajs/types"
import { CommonEvents, FulfillmentUtils, Modules } from "@medusajs/utils"

export function buildFulfillmentAddressEvents({
  action,
  fulfillmentAddresses,
  sharedContext,
}: {
  action: string
  fulfillmentAddresses: { id: string }[]
  sharedContext: Context
}) {
  if (!fulfillmentAddresses.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  fulfillmentAddresses.forEach((fulfillmentAddress) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action,
      context: sharedContext,
      data: { id: fulfillmentAddress.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`fulfillment_address_${action}`],
      object: "fulfillment_address",
    })
  })

  aggregator.saveRawMessageData(messages)
}

export function buildFulfillmentItemEvents({
  action,
  fulfillmentItems,
  sharedContext,
}: {
  action: string
  fulfillmentItems: { id: string }[]
  sharedContext: Context
}) {
  if (!fulfillmentItems.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  fulfillmentItems.forEach((fulfillmentItem) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action,
      context: sharedContext,
      data: { id: fulfillmentItem.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`fulfillment_item_${action}`],
      object: "fulfillment_item",
    })
  })

  aggregator.saveRawMessageData(messages)
}

export function buildFulfillmentLabelEvents({
  action,
  fulfillmentLabels,
  sharedContext,
}: {
  action: string
  fulfillmentLabels: { id: string }[]
  sharedContext: Context
}) {
  if (!fulfillmentLabels.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  fulfillmentLabels.forEach((fulfillmentLabel) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action,
      context: sharedContext,
      data: { id: fulfillmentLabel.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`fulfillment_label_${action}`],
      object: "fulfillment_label",
    })
  })

  aggregator.saveRawMessageData(messages)
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

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  let addresses: { id: string }[] = []
  let items: { id: string }[] = []
  let labels: { id: string }[] = []

  fulfillments.forEach((fulfillment) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action: CommonEvents.CREATED,
      context: sharedContext,
      data: { id: fulfillment.id },
      eventName: FulfillmentUtils.FulfillmentEvents.fulfillment_created,
      object: "fulfillment",
    })

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

  aggregator.saveRawMessageData(messages)

  if (addresses.length) {
    buildFulfillmentAddressEvents({
      action: CommonEvents.CREATED,
      fulfillmentAddresses: addresses,
      sharedContext,
    })
  }

  if (items.length) {
    buildFulfillmentItemEvents({
      action: CommonEvents.CREATED,
      fulfillmentItems: items,
      sharedContext,
    })
  }

  if (labels.length) {
    buildFulfillmentLabelEvents({
      action: CommonEvents.CREATED,
      fulfillmentLabels: labels,
      sharedContext,
    })
  }
}

export function buildShippingProfileEvents({
  action,
  shippingProfiles,
  sharedContext,
}: {
  action: string
  shippingProfiles: ShippingProfile[]
  sharedContext: Context
}) {
  if (!shippingProfiles.length) {
    return
  }

  const aggregator = sharedContext.messageAggregator!
  const messages: EventBusTypes.RawMessageFormat[] = []

  shippingProfiles.forEach((shippingOptionType) => {
    messages.push({
      service: Modules.FULFILLMENT,
      action,
      context: sharedContext,
      data: { id: shippingOptionType.id },
      eventName:
        FulfillmentUtils.FulfillmentEvents[`shipping_profile_${action}`],
      object: "shipping_profile",
    })
  })

  aggregator.saveRawMessageData(messages)
}

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
      action,
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
      action,
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
      action,
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
      action,
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
      action,
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
