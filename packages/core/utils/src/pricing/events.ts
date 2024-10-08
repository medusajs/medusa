import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "priceListRule",
  "priceList",
  "priceRule",
  "priceSet",
  "price"
] = ["priceListRule", "priceList", "priceRule", "priceSet", "price"]

export const PricingEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRICING
)
