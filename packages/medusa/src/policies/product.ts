import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const productResources = [
  "product",
  "product_variant",
  "product_option",
  "product_option_value",
  "product_tag",
  "product_type",
  "product_category",
  "product_collection",
]

export const productPolicies = definePolicies(
  generateResourcePolicies(productResources)
)
