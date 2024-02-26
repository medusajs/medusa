import { useAdminOrder } from "medusa-react"
import { useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { OrderCustomerSection } from "./components/order-customer-section"
import { OrderFulfillmentSection } from "./components/order-fulfillment-section"
import { OrderGeneralSection } from "./components/order-general-section"
import { OrderPaymentSection } from "./components/order-payment-section"
import { OrderSummarySection } from "./components/order-summary-section"
import { orderExpand } from "./constants"
import { orderLoader } from "./loader"

export const OrderDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof orderLoader>>

  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(
    id!,
    {
      expand: orderExpand,
    },
    {
      initialData,
    }
  )

  if (isLoading || !order) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[1fr,400px]">
      <div className="flex flex-col gap-y-2">
        <OrderGeneralSection order={order} />
        <OrderSummarySection order={order} />
        <OrderPaymentSection order={order} />
        <OrderFulfillmentSection order={order} />
        <div className="flex flex-col gap-y-2 lg:hidden">
          <OrderCustomerSection order={order} />
        </div>
        <JsonViewSection data={order} />
      </div>
      <div className="hidden flex-col gap-y-2 lg:flex">
        <OrderCustomerSection order={order} />
      </div>
    </div>
  )
}
