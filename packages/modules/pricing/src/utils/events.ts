import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  PricingEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdPriceSet: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_set",
    eventsEnum: PricingEvents,
  }),
  createdPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  createdPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
  createdPriceList: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list",
    eventsEnum: PricingEvents,
  }),
  createdPriceListRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
  attachedPriceListRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.ATTACHED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
  updatedPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  updatedPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
  deletedPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  deletedPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
}
