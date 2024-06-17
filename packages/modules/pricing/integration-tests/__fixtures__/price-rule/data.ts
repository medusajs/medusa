import { CreatePriceRuleDTO } from "@medusajs/types"

export * from "./data"

export const defaultPriceRuleData = [
  {
    id: "price-rule-1",
    price_set_id: "price-set-1",
    rule_type_id: "rule-type-1",
    value: "USD",
    price_list_id: "test",
    price_id: "price-set-money-amount-USD",
  },
  {
    id: "price-rule-2",
    price_set_id: "price-set-2",
    rule_type_id: "rule-type-2",
    value: "region_1",
    price_list_id: "test",
    price_id: "price-set-money-amount-EUR",
  },
] as unknown as CreatePriceRuleDTO[]
