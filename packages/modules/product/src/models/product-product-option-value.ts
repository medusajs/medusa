import { model } from "@medusajs/framework/utils"
import ProductOptionValue from "./product-option-value"
import ProductProductOption from "./product-product-option"

/**
 * @since 2.16.0
 */
const ProductProductOptionValue = model.define("ProductProductOptionValue", {
  id: model.id({ prefix: "prodoptval" }).primaryKey(),
  product_product_option: model.belongsTo(() => ProductProductOption, {
    mappedBy: "values",
  }),
  product_option_value: model.belongsTo(() => ProductOptionValue, {
    mappedBy: "product_options",
  }),
})

export default ProductProductOptionValue
