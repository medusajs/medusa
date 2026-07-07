import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useProductVariant } from "../../../hooks/api"
import { VARIANT_DETAIL_FIELDS } from "./constants"

type ProductVariantDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminProductVariantResponse>

export const ProductVariantDetailBreadcrumb = (
  props: ProductVariantDetailBreadcrumbProps
) => {
  const { id, variant_id } = props.params || {}

  const { variant } = useProductVariant(
    id!,
    variant_id!,
    {
      fields: VARIANT_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id) && Boolean(variant_id),
    }
  )

  if (!variant) {
    return null
  }

  return <span>{variant.title}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminProductVariantResponse>) => ({
  title: match.data?.variant?.title,
})
