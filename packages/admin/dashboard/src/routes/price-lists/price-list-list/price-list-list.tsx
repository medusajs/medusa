import { Outlet } from "react-router-dom"

import { PriceListListTable } from "./components/price-list-list-table"

import after from "virtual:medusa/widgets/price_list/list/after"
import before from "virtual:medusa/widgets/price_list/list/before"

export const PriceListList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <PriceListListTable />
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
