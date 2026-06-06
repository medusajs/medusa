import { model } from "@zjedene-medusa/framework/utils"
import PromotionRule from "./promotion-rule"

const PromotionRuleValue = model
  .define(
    { name: "PromotionRuleValue", tableName: "promotion_rule_value" },
    {
      id: model.id({ prefix: "prorulval" }).primaryKey(),
      value: model.text(),
      promotion_rule: model.belongsTo(() => PromotionRule, {
        mappedBy: "values",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_promotion_rule_value_rule_id_value",
      on: ["promotion_rule_id", "value"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_promotion_rule_value_value",
      on: ["value"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default PromotionRuleValue
