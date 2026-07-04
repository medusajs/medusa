import { model } from "@medusajs/framework/utils"
import ProductOption from "./product-option"
import ProductProductOption from "./product-product-option"
import ProductProductOptionValue from "./product-product-option-value"
import ProductVariant from "./product-variant"

const ProductOptionValue = model
  .define("ProductOptionValue", {
    id: model.id({ prefix: "optval" }).primaryKey(),
    value: model.text().searchable().translatable(),
    /**
     * @since 2.16.0
     */
    rank: model.number().nullable(),
    metadata: model.json().nullable(),
    option: model
      .belongsTo(() => ProductOption, {
        mappedBy: "values",
      })
      .nullable(),
    variants: model.manyToMany(() => ProductVariant, {
      mappedBy: "options",
    }),
    /**
     * @since 2.16.0
     */
    product_options: model.manyToMany(() => ProductProductOption, {
      pivotEntity: () => ProductProductOptionValue,
      mappedBy: "values",
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
