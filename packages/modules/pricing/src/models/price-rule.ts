import { model, PricingRuleOperator } from "@zjedene-medusa/framework/utils"
import Price from "./price"

const PriceRule = model
  .define("PriceRule", {
    id: model.id({ prefix: "prule" }).primaryKey(),
    attribute: model.text(),
    value: model.text(),
    operator: model.enum(PricingRuleOperator).default(PricingRuleOperator.EQ),
    priority: model.number().default(0),
    price: model.belongsTo(() => Price, {
      mappedBy: "price_rules",
    }),
  })
  .indexes([
    {
      on: ["price_id", "attribute", "operator"],
      where: "deleted_at IS NULL",
      unique: true,
    },
    {
      on: ["attribute"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["attribute", "value"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["operator", "value"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["attribute", "value", "price_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default PriceRule
