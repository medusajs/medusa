import { Outlet } from "react-router-dom"

import { RegionListTable } from "./components/region-list-table"

import after from "virtual:medusa/widgets/region/list/after"
import before from "virtual:medusa/widgets/region/list/before"

export const RegionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <RegionListTable />
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
