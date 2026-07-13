import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useSalesChannel } from "../../../hooks/api/sales-channels"

type SalesChannelDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminSalesChannelResponse>

export const SalesChannelDetailBreadcrumb = (
  props: SalesChannelDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { sales_channel } = useSalesChannel(id!, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!sales_channel) {
    return null
  }

  return <span>{sales_channel.name}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminSalesChannelResponse>) => ({
  title: match.data?.sales_channel?.name,
})
