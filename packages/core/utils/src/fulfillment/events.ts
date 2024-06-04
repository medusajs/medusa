import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "fulfillmentSet",
  "serviceZone",
  "geoZone",
  "shippingOption",
  "shippingOptionType",
  "shippingProfile",
  "shippingOptionRule",
  "fulfillment",
  "fulfillmentAddress",
  "fulfillmentItem",
  "fulfillmentLabel"
] = [
  "fulfillmentSet",
  "serviceZone",
  "geoZone",
  "shippingOption",
  "shippingOptionType",
  "shippingProfile",
  "shippingOptionRule",
  "fulfillment",
  "fulfillmentAddress",
  "fulfillmentItem",
  "fulfillmentLabel",
]

export const FulfillmentEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.FULFILLMENT
)
