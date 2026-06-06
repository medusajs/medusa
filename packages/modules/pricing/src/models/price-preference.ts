import { model } from "@zjedene-medusa/framework/utils"

const PricePreference = model
  .define("PricePreference", {
    id: model.id({ prefix: "prpref" }).primaryKey(),
    attribute: model.text(),
    value: model.text().nullable(),
    is_tax_inclusive: model.boolean().default(false),
  })
  .indexes([
    {
      name: "IDX_price_preference_attribute_value",
      on: ["attribute", "value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default PricePreference
