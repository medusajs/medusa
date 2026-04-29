// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@medusajs/types"
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

export const FulfillmentEvents = {
  ...buildEventNamesFromEntityName(eventBaseNames, Modules.FULFILLMENT),
  /**
   * @deprecated use `FulfillmentWorkflowEvents.SHIPMENT_CREATED` instead
   */
  SHIPMENT_CREATED: "shipment.created",
  /**
   * @deprecated use `FulfillmentWorkflowEvents.DELIVERY_CREATED` instead
   */
  DELIVERY_CREATED: "delivery.created",
} as const

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@medusajs/types" {
//   export interface EventBusEventsOptions {
//     // Fulfillment Set events
//     [FulfillmentEvents.FULFILLMENT_SET_CREATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_SET_UPDATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_SET_DELETED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_SET_RESTORED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_SET_ATTACHED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_SET_DETACHED]?: EventOptions

//     // Service Zone events
//     [FulfillmentEvents.SERVICE_ZONE_CREATED]?: EventOptions
//     [FulfillmentEvents.SERVICE_ZONE_UPDATED]?: EventOptions
//     [FulfillmentEvents.SERVICE_ZONE_DELETED]?: EventOptions
//     [FulfillmentEvents.SERVICE_ZONE_RESTORED]?: EventOptions
//     [FulfillmentEvents.SERVICE_ZONE_ATTACHED]?: EventOptions
//     [FulfillmentEvents.SERVICE_ZONE_DETACHED]?: EventOptions

//     // Geo Zone events
//     [FulfillmentEvents.GEO_ZONE_CREATED]?: EventOptions
//     [FulfillmentEvents.GEO_ZONE_UPDATED]?: EventOptions
//     [FulfillmentEvents.GEO_ZONE_DELETED]?: EventOptions
//     [FulfillmentEvents.GEO_ZONE_RESTORED]?: EventOptions
//     [FulfillmentEvents.GEO_ZONE_ATTACHED]?: EventOptions
//     [FulfillmentEvents.GEO_ZONE_DETACHED]?: EventOptions

//     // Shipping Option events
//     [FulfillmentEvents.SHIPPING_OPTION_CREATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_UPDATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_DELETED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RESTORED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_ATTACHED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_DETACHED]?: EventOptions

//     // Shipping Option Type events
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_CREATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_UPDATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_DELETED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_RESTORED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_ATTACHED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_TYPE_DETACHED]?: EventOptions

//     // Shipping Profile events
//     [FulfillmentEvents.SHIPPING_PROFILE_CREATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_PROFILE_UPDATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_PROFILE_DELETED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_PROFILE_RESTORED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_PROFILE_ATTACHED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_PROFILE_DETACHED]?: EventOptions

//     // Shipping Option Rule events
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_CREATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_UPDATED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_DELETED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_RESTORED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_ATTACHED]?: EventOptions
//     [FulfillmentEvents.SHIPPING_OPTION_RULE_DETACHED]?: EventOptions

//     // Fulfillment events
//     [FulfillmentEvents.FULFILLMENT_CREATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_UPDATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_DELETED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_RESTORED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ATTACHED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_DETACHED]?: EventOptions

//     // Fulfillment Address events
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_CREATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_UPDATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_DELETED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_RESTORED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_ATTACHED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ADDRESS_DETACHED]?: EventOptions

//     // Fulfillment Item events
//     [FulfillmentEvents.FULFILLMENT_ITEM_CREATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ITEM_UPDATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ITEM_DELETED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ITEM_RESTORED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ITEM_ATTACHED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_ITEM_DETACHED]?: EventOptions

//     // Fulfillment Label events
//     [FulfillmentEvents.FULFILLMENT_LABEL_CREATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_LABEL_UPDATED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_LABEL_DELETED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_LABEL_RESTORED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_LABEL_ATTACHED]?: EventOptions
//     [FulfillmentEvents.FULFILLMENT_LABEL_DETACHED]?: EventOptions

//     // Deprecated events
//     [FulfillmentEvents.SHIPMENT_CREATED]?: EventOptions
//     [FulfillmentEvents.DELIVERY_CREATED]?: EventOptions
//   }
// }
