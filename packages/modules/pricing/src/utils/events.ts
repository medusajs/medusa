import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  PricingEvents,
} from "@medusajs/framework/utils"

export const eventBuilders = {
  createdPriceSet: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_set",
    eventName: PricingEvents.PRICE_SET_CREATED,
  }),
  createdPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price",
    eventName: PricingEvents.PRICE_CREATED,
  }),
  createdPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_rule",
    eventName: PricingEvents.PRICE_RULE_CREATED,
  }),
  createdPriceList: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list",
    eventName: PricingEvents.PRICE_LIST_CREATED,
  }),
  createdPriceListRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list_rule",
    eventName: PricingEvents.PRICE_LIST_RULE_CREATED,
  }),
  attachedPriceListRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.ATTACHED,
    object: "price_list_rule",
    eventName: PricingEvents.PRICE_LIST_RULE_ATTACHED,
  }),
  updatedPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price",
    eventName: PricingEvents.PRICE_UPDATED,
  }),
  updatedPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.UPDATED,
    object: "price_rule",
    eventName: PricingEvents.PRICE_RULE_UPDATED,
  }),
  deletedPrice: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price",
    eventName: PricingEvents.PRICE_DELETED,
  }),
  deletedPriceRule: moduleEventBuilderFactory({
    source: Modules.PRICING,
    action: CommonEvents.DELETED,
    object: "price_rule",
    eventName: PricingEvents.PRICE_RULE_DELETED,
  }),
}
