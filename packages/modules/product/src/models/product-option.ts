import { model } from "@medusajs/framework/utils"
import { Product } from "./index"
import ProductOptionValue from "./product-option-value"

const ProductOption = model
  .define("ProductOption", {
    id: model.id({ prefix: "opt" }).primaryKey(),
    title: model.text().searchable().translatable(),
    /**
     * @since 2.16.0
     */
    is_exclusive: model.boolean().default(false),
    metadata: model.json().nullable(),
    /**
     * @since 2.16.0
     */
    products: model.manyToMany(() => Product),
    values: model.hasMany(() => ProductOptionValue, {
      mappedBy: "option",
    }),
  })
  .cascades({
    delete: ["values"],
    detach: ["products"],
  })

export default ProductOption
