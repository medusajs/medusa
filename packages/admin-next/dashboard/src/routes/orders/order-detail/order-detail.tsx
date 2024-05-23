import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { OrderActivitySection } from "./components/order-activity-section"
import { OrderCustomerSection } from "./components/order-customer-section"
import { OrderFulfillmentSection } from "./components/order-fulfillment-section"
import { OrderGeneralSection } from "./components/order-general-section"
import { OrderPaymentSection } from "./components/order-payment-section"
import { OrderSummarySection } from "./components/order-summary-section"
import { DEFAULT_FIELDS } from "./constants"
import { orderLoader } from "./loader"
import { useOrder } from "../../../hooks/api/orders"

export const OrderDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof orderLoader>>

  const { id } = useParams()

  const { order, isLoading, isError, error } = useOrder(
    id!,
    {
      fields: DEFAULT_FIELDS,
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
    <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
      <div className="flex w-full flex-col gap-y-2">
        <OrderGeneralSection order={order} />
        <OrderSummarySection order={order} />
        {/*<OrderPaymentSection order={order} />*/}
        <OrderFulfillmentSection order={order} />
        <div className="flex flex-col gap-y-2 xl:hidden">
          <OrderCustomerSection order={order} />
          <OrderActivitySection order={order} />
        </div>
        <JsonViewSection data={order} />
      </div>
      <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
        <OrderCustomerSection order={order} />
        <OrderActivitySection order={order} />
      </div>
      <Outlet />
    </div>
  )
}
