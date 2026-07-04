import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useProductCategory } from "../../../hooks/api"

type CategoryDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminProductCategoryResponse>

export const CategoryDetailBreadcrumb = (
  props: CategoryDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { product_category } = useProductCategory(
    id!,
    {
      fields: "name",
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!product_category) {
    return null
  }

  return <span>{product_category.name}</span>
}

export const seo = (
  match: UIMatch<HttpTypes.AdminProductCategoryResponse>
) => ({
  title: match.data?.product_category?.name,
})
