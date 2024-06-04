import { Outlet } from "react-router-dom"

import { SalesChannelListTable } from "./components/sales-channel-list-table"

import after from "virtual:medusa/widgets/sales_channel/list/after"
import before from "virtual:medusa/widgets/sales_channel/list/before"

export const SalesChannelList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <SalesChannelListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component key={i} />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
