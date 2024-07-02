import {
  CommonEvents,
  eventBuilderFactory,
  Modules,
  PricingEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdPriceSet: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_set",
    eventsEnum: PricingEvents,
  }),
  createdPrice: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  createdPriceRule: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
  createdPriceList: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list",
    eventsEnum: PricingEvents,
  }),
  createdPriceListRule: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
  attachedPriceListRule: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.ATTACHED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
  updatedPrice: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  updatedPriceRule: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
  deletedPrice: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  deletedPriceRule: eventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
}
