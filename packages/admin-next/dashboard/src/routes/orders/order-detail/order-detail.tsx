import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useOrder } from "../../../hooks/api/orders"
import { OrderActivitySection } from "./components/order-activity-section"
import { OrderCustomerSection } from "./components/order-customer-section"
import { OrderFulfillmentSection } from "./components/order-fulfillment-section"
import { OrderGeneralSection } from "./components/order-general-section"
import { OrderSummarySection } from "./components/order-summary-section"
import { DEFAULT_FIELDS } from "./constants"
import { orderLoader } from "./loader"

import after from "virtual:medusa/widgets/order/details/after"
import before from "virtual:medusa/widgets/order/details/before"
import sideAfter from "virtual:medusa/widgets/order/details/side/after"
import sideBefore from "virtual:medusa/widgets/order/details/side/before"

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
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={order} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 lg:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <OrderGeneralSection order={order} />
          <OrderSummarySection order={order} />
          {/* <OrderPaymentSection order={order} />*/}
          <OrderFulfillmentSection order={order} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={order} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={order} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={order} />
              </div>
            )
          })}
          <OrderCustomerSection order={order} />
          <OrderActivitySection order={order} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={order} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={order} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
