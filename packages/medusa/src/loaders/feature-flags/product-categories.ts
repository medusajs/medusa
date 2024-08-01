import { FlagSettings } from "@medusajs/framework"

const ProductCategoryFeatureFlag: FlagSettings = {
  key: "product_categories",
  default_val: false,
  env_key: "MEDUSA_FF_PRODUCT_CATEGORIES",
  description: "[WIP] Enable the product categories feature",
}

export default ProductCategoryFeatureFlag
