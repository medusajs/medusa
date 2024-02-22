import { useAdminOrder } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { OrderGeneralSection } from "./components/order-general-section"
import { OrderSummarySection } from "./components/order-summary-section"

export const OrderDetail = () => {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(id!, {
    expand:
      "items,items.variant,items.variant.options,sales_channel,shipping_methods,shipping_methods.shipping_option,discounts",
  })

  if (isLoading || !order) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <OrderGeneralSection order={order} />
      <OrderSummarySection order={order} />
      <JsonViewSection data={order} />
    </div>
  )
}
