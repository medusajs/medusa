import { CreatePriceRuleDTO } from "@medusajs/types"

export * from "./data"

export const defaultPriceRuleData = [
  {
    id: "price-rule-1",
    price_set_id: "price-set-1",
    attribute: "currency_code",
    value: "USD",
    price_list_id: "test",
    price_id: "price-set-money-amount-USD",
  },
  {
    id: "price-rule-2",
    price_set_id: "price-set-2",
    attribute: "region_id",
    value: "region_1",
    price_list_id: "test",
    price_id: "price-set-money-amount-EUR",
  },
] as unknown as CreatePriceRuleDTO[]
