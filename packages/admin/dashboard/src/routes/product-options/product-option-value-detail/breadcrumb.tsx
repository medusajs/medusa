import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

export const ProductOptionValueBreadcrumb = (
  match: UIMatch<HttpTypes.AdminProductOptionValueResponse>
) => {
  const productOptionValue = match.data.product_option_value

  if (!productOptionValue) {
    return null
  }

  return <span>{productOptionValue.value}</span>
}
