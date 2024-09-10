import { OrderListTable } from "./components/order-list-table"

import after from "virtual:medusa/widgets/order/list/after"
import before from "virtual:medusa/widgets/order/list/before"

export const OrderList = () => {
  return (
    <div className="flex w-full flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <OrderListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
    </div>
  )
}
