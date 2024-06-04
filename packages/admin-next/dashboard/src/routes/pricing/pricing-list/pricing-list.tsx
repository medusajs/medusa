import { Outlet } from "react-router-dom"

import { PricingListTable } from "./components/pricing-list-table"

import after from "virtual:medusa/widgets/price_list/list/after"
import before from "virtual:medusa/widgets/price_list/list/before"

export const PricingList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <PricingListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
