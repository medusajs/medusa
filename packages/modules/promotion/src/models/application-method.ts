import { PromotionUtils, model } from "@zjedene-medusa/framework/utils"
import Promotion from "./promotion"
import PromotionRule from "./promotion-rule"

const ApplicationMethod = model
  .define(
    { name: "ApplicationMethod", tableName: "promotion_application_method" },
    {
      id: model.id({ prefix: "proappmet" }).primaryKey(),
      value: model.bigNumber().nullable(),
      currency_code: model.text().nullable(),
      max_quantity: model.number().nullable(),
      apply_to_quantity: model.number().nullable(),
      buy_rules_min_quantity: model.number().nullable(),
      type: model
        .enum(PromotionUtils.ApplicationMethodType)
        .index("IDX_application_method_type"),
      target_type: model
        .enum(PromotionUtils.ApplicationMethodTargetType)
        .index("IDX_application_method_target_type"),
      allocation: model
        .enum(PromotionUtils.ApplicationMethodAllocation)
        .index("IDX_application_method_allocation")
        .nullable(),
      promotion: model.belongsTo(() => Promotion, {
        mappedBy: "application_method",
      }),
      target_rules: model.manyToMany(() => PromotionRule, {
        pivotTable: "application_method_target_rules",
        mappedBy: "method_target_rules",
      }),
      buy_rules: model.manyToMany(() => PromotionRule, {
        pivotTable: "application_method_buy_rules",
        mappedBy: "method_buy_rules",
      }),
    }
  )
  .indexes([
    {
      on: ["currency_code"],
      where: "deleted_at IS NOT NULL",
    },
  ])

export default ApplicationMethod
