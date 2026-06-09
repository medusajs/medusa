import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { usePriceList } from "../../../hooks/api"

type PriceListDetailBreadcrumbProps = UIMatch<HttpTypes.AdminPriceListResponse>

export const PriceListDetailBreadcrumb = (
  props: PriceListDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { price_list } = usePriceList(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!price_list) {
    return null
  }

  return <span>{price_list.title}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminPriceListResponse>) => ({
  title: match.data?.price_list?.title,
})
