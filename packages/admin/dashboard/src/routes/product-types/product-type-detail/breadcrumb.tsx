import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useProductType } from "../../../hooks/api"

type ProductTypeDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminProductTypeResponse>

export const ProductTypeDetailBreadcrumb = (
  props: ProductTypeDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { product_type } = useProductType(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!product_type) {
    return null
  }

  return <span>{product_type.value}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminProductTypeResponse>) => ({
  title: match.data?.product_type?.value,
})
