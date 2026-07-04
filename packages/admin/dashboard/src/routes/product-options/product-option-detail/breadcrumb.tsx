import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

export const ProductOptionBreadcrumb = (
  match: UIMatch<HttpTypes.AdminProductOptionResponse>
) => {
  const productOption = match.data.product_option

  if (!productOption) {
    return null
  }

  return <span>{productOption.title}</span>
}
