import { model } from "@zjedene-medusa/framework/utils"
import TaxProvider from "./tax-provider"
import TaxRate from "./tax-rate"

export const taxRegionProviderTopLevelCheckName =
  "CK_tax_region_provider_top_level"
export const taxRegionCountryTopLevelCheckName =
  "CK_tax_region_country_top_level"

const TaxRegion = model
  .define("TaxRegion", {
    id: model.id({ prefix: "txreg" }).primaryKey(),
    country_code: model.text().searchable(),
    province_code: model.text().searchable().nullable(),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
    provider: model
      .belongsTo(() => TaxProvider, {
        mappedBy: "regions",
      })
      .nullable(),
    parent: model
      .belongsTo(() => TaxRegion, {
        mappedBy: "children",
      })
      .nullable(),
    children: model.hasMany(() => TaxRegion, {
      mappedBy: "parent",
    }),
    tax_rates: model.hasMany(() => TaxRate, {
      mappedBy: "tax_region",
    }),
  })
  .checks([
    {
      name: taxRegionProviderTopLevelCheckName,
      expression: `parent_id IS NULL OR provider_id IS NULL`,
    },
    {
      name: taxRegionCountryTopLevelCheckName,
      expression: `parent_id IS NULL OR province_code IS NOT NULL`,
    },
  ])
  .indexes([
    {
      name: "IDX_tax_region_unique_country_province",
      on: ["country_code", "province_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_tax_region_unique_country_nullable_province",
      on: ["country_code"],
      unique: true,
      where: "province_code IS NULL AND deleted_at IS NULL",
    },
  ])
  .cascades({
    delete: ["children", "tax_rates"],
  })
export default TaxRegion
