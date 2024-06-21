import { Outlet } from "react-router-dom"
import { TaxRegionListView } from "./components/tax-region-list-view"

import after from "virtual:medusa/widgets/tax/list/after"
import before from "virtual:medusa/widgets/tax/list/before"

export const TaxRegionsList = () => {
  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <TaxRegionListView />
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
