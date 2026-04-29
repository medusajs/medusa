import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useProduct } from "../../../hooks/api"

type ProductDetailBreadcrumbProps = UIMatch<HttpTypes.AdminProductResponse>

export const ProductDetailBreadcrumb = (
  props: ProductDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { product } = useProduct(
    id!,
    {
      // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
      fields:
        "-type,-collection,-options,-tags,-images,-variants,-sales_channels",
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!product) {
    return null
  }

  return <span>{product.title}</span>
}
