import {} from "@models"
import {
  Modules,
  CommonEvents,
  PricingEvents,
  eventBuilderFactory,
} from "@medusajs/utils"

export const eventBuilders = {
  createdPriceSet: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_set",
    eventsEnum: PricingEvents,
  }),
  createdPriceSetRuleType: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_set_rule_type",
    eventsEnum: PricingEvents,
  }),
  createdPrice: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price",
    eventsEnum: PricingEvents,
  }),
  createdPriceRule: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_rule",
    eventsEnum: PricingEvents,
  }),
  createdPriceList: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list",
    eventsEnum: PricingEvents,
  }),
  createdPriceListRule: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.CREATED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
  attachedPriceListRule: eventBuilderFactory({
    service: Modules.PRICING,
    action: CommonEvents.ATTACHED,
    object: "price_list_rule",
    eventsEnum: PricingEvents,
  }),
}
