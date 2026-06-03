import { model } from "@medusajs/framework/utils"
import Product from "./product"
import ProductOption from "./product-option"
import ProductOptionValue from "./product-option-value"
import ProductProductOptionValue from "./product-product-option-value"

/**
 * @since 2.16.0
 */
const ProductProductOption = model.define("ProductProductOption", {
  id: model.id({ prefix: "prodopt" }).primaryKey(),
  product: model.belongsTo(() => Product, {
    mappedBy: "options",
  }),
  product_option: model.belongsTo(() => ProductOption, {
    mappedBy: "products",
  }),
  values: model.manyToMany(() => ProductOptionValue, {
    pivotEntity: () => ProductProductOptionValue,
  }),
})

export default ProductProductOption
