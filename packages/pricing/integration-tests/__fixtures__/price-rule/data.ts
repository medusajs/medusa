import { CreatePriceRuleDTO } from "@medusajs/types"

export const defaultPriceRuleData = [
  {
    id: "price-rule-1",
    price_set_id: "price-set-1",
    rule_type_id: "rule-type-1",
    value: "region_1",
    price_list_id: "test",
    price_set_money_amount: {
      money_amount: { amount: 100, currency_code: "EUR" },
    },
  },
  {
    id: "price-rule-2",
    price_set_id: "price-set-2",
    rule_type_id: "rule-type-1",
    value: "region_2",
    price_list_id: "test",
    price_set_money_amount: {
      money_amount: { amount: 100, currency_code: "EUR" },
    },
  },
] as unknown as CreatePriceRuleDTO[]
