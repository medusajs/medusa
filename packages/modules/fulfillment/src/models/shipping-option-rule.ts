import { model, RuleOperator } from "@zjedene-medusa/framework/utils"
import { ShippingOption } from "./shipping-option"

export const ShippingOptionRule = model.define("shipping_option_rule", {
  id: model.id({ prefix: "sorul" }).primaryKey(),
  attribute: model.text(),
  operator: model.enum(RuleOperator),
  value: model.json().nullable(),
  shipping_option: model.belongsTo(() => ShippingOption, {
    mappedBy: "rules",
  }),
})
