import { model } from "@medusajs/framework/utils"
import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

const ProductOption = model
  .define("ProductOption", {
    id: model.id({ prefix: "opt" }).primaryKey(),
    title: model.text().searchable().translatable(),
    metadata: model.json().nullable(),
    product: model.belongsTo(() => Product, {
      mappedBy: "options",
    }),
    values: model.hasMany(() => ProductOptionValue, {
      mappedBy: "option",
    }),
  })
  .cascades({
    delete: ["values"],
  })
  .indexes([
    {
      name: "IDX_option_product_id_title_unique",
      on: ["product_id", "title"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductOption
