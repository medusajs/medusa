import { buildEventNamesFromEntityName } from "../event-bus"

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

export const FulfillmentEvents = buildEventNamesFromEntityName(eventBaseNames)
