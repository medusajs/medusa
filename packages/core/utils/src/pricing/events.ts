import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "priceListRuleValue",
  "priceListRule",
  "priceList",
  "priceRule",
  "priceSetRuleType",
  "priceSet",
  "price",
  "ruleType"
] = [
  "priceListRuleValue",
  "priceListRule",
  "priceList",
  "priceRule",
  "priceSetRuleType",
  "priceSet",
  "price",
  "ruleType",
]

export const PricingEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRICING
)
