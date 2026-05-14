// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@medusajs/types"
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

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@medusajs/types" {
//   export interface EventBusEventsOptions {
//     // Price List Rule events
//     [PricingEvents.PRICE_LIST_RULE_CREATED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RULE_UPDATED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RULE_DELETED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RULE_RESTORED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RULE_ATTACHED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RULE_DETACHED]?: EventOptions

//     // Price List events
//     [PricingEvents.PRICE_LIST_CREATED]?: EventOptions
//     [PricingEvents.PRICE_LIST_UPDATED]?: EventOptions
//     [PricingEvents.PRICE_LIST_DELETED]?: EventOptions
//     [PricingEvents.PRICE_LIST_RESTORED]?: EventOptions
//     [PricingEvents.PRICE_LIST_ATTACHED]?: EventOptions
//     [PricingEvents.PRICE_LIST_DETACHED]?: EventOptions

//     // Price Rule events
//     [PricingEvents.PRICE_RULE_CREATED]?: EventOptions
//     [PricingEvents.PRICE_RULE_UPDATED]?: EventOptions
//     [PricingEvents.PRICE_RULE_DELETED]?: EventOptions
//     [PricingEvents.PRICE_RULE_RESTORED]?: EventOptions
//     [PricingEvents.PRICE_RULE_ATTACHED]?: EventOptions
//     [PricingEvents.PRICE_RULE_DETACHED]?: EventOptions

//     // Price Set events
//     [PricingEvents.PRICE_SET_CREATED]?: EventOptions
//     [PricingEvents.PRICE_SET_UPDATED]?: EventOptions
//     [PricingEvents.PRICE_SET_DELETED]?: EventOptions
//     [PricingEvents.PRICE_SET_RESTORED]?: EventOptions
//     [PricingEvents.PRICE_SET_ATTACHED]?: EventOptions
//     [PricingEvents.PRICE_SET_DETACHED]?: EventOptions

//     // Price events
//     [PricingEvents.PRICE_CREATED]?: EventOptions
//     [PricingEvents.PRICE_UPDATED]?: EventOptions
//     [PricingEvents.PRICE_DELETED]?: EventOptions
//     [PricingEvents.PRICE_RESTORED]?: EventOptions
//     [PricingEvents.PRICE_ATTACHED]?: EventOptions
//     [PricingEvents.PRICE_DETACHED]?: EventOptions
//   }
// }
