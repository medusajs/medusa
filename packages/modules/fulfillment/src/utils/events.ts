import { FulfillmentSet, GeoZone, ServiceZone } from "@models"
import { Context, EventBusTypes } from "@medusajs/types"
import { CommonEvents, FulfillmentUtils, Modules } from "@medusajs/utils"

export function buildCreatedFulfillmentSetEvents({
  fulfillmentSets,
  sharedContext,
}: {
  fulfillmentSets: FulfillmentSet[]
  sharedContext: Context
}): void {
  const serviceZones: ServiceZone[] = []

  fulfillmentSets.flatMap((fulfillmentSet) => {
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
  const geoZones: GeoZone[] = []

  serviceZones.flatMap((serviceZone) => {
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

export function buildFulfillmentSetEvents({
  action,
  fulfillmentSets,
  sharedContext,
}: {
  action: string
  fulfillmentSets: FulfillmentSet[]
  sharedContext: Context
}) {
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
