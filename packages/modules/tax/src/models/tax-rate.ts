import { model } from "@medusajs/framework/utils"
import TaxRateRule from "./tax-rate-rule"
import TaxRegion from "./tax-region"

const TaxRate = model
  .define("TaxRate", {
    id: model.id({ prefix: "txr" }).primaryKey(),
    rate: model.float().nullable(),
    code: model.text().searchable(),
    name: model.text().searchable().translatable(),
    is_default: model.boolean().default(false),
    is_combinable: model.boolean().default(false),
    tax_region: model.belongsTo(() => TaxRegion, {
      mappedBy: "tax_rates",
    }),
    rules: model.hasMany(() => TaxRateRule, {
      mappedBy: "tax_rate",
    }),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
  })
  .indexes([
    {
      name: "IDX_tax_rate_tax_region_id",
      on: ["tax_region_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_single_default_region",
      on: ["tax_region_id"],
      unique: true,
      where: "is_default = true AND deleted_at IS NULL",
    },
  ])
  .cascades({
    delete: ["rules"],
  })

export default TaxRate
