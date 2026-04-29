import { model } from "@medusajs/framework/utils"
import { ProductOption, ProductVariant } from "./index"

const ProductOptionValue = model
  .define("ProductOptionValue", {
    id: model.id({ prefix: "optval" }).primaryKey(),
    value: model.text().translatable(),
    metadata: model.json().nullable(),
    option: model
      .belongsTo(() => ProductOption, {
        mappedBy: "values",
      })
      .nullable(),
    variants: model.manyToMany(() => ProductVariant, {
      mappedBy: "options",
    }),
  })
  .indexes([
    {
      name: "IDX_option_value_option_id_unique",
      on: ["option_id", "value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductOptionValue
