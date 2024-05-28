import { Outlet } from "react-router-dom"
import { TaxRegionListTable } from "./components/region-list-table"

import after from "virtual:medusa/widgets/tax/list/after"
import before from "virtual:medusa/widgets/tax/list/before"

export const TaxRegionsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <TaxRegionListTable />
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
