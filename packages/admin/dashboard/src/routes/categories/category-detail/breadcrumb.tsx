import { HttpTypes } from "@zjedene-medusa/types"
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
