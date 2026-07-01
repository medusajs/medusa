import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useProductTag } from "../../../hooks/api"

type ProductTagDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminProductTagResponse>

export const ProductTagDetailBreadcrumb = (
  props: ProductTagDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { product_tag } = useProductTag(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!product_tag) {
    return null
  }

  return <span>{product_tag.value}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminProductTagResponse>) => ({
  title: match.data?.product_tag?.value,
})
