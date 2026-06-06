import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"
import { useOrder } from "../../../hooks/api"
import { DEFAULT_FIELDS } from "./constants"

type OrderDetailBreadcrumbProps = UIMatch<HttpTypes.AdminOrderResponse>

export const OrderDetailBreadcrumb = (props: OrderDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { order } = useOrder(
    id!,
    {
      fields: DEFAULT_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!order) {
    return null
  }

  return <span>#{order.display_id}</span>
}
