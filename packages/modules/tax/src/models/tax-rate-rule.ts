import { model } from "@zjedene-medusa/framework/utils"
import TaxRate from "./tax-rate"

const TaxRateRule = model
  .define("TaxRateRule", {
    id: model.id({ prefix: "txrule" }).primaryKey(),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
    tax_rate: model.belongsTo(() => TaxRate, {
      mappedBy: "rules",
    }),
    reference: model.text(),
    reference_id: model.text(),
  })
  .indexes([
    {
      name: "IDX_tax_rate_rule_reference_id",
      on: ["reference_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_tax_rate_rule_unique_rate_reference",
      on: ["tax_rate_id", "reference_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default TaxRateRule
