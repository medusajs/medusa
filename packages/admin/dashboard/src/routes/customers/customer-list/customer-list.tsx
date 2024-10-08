import { Outlet } from "react-router-dom"

import { CustomerListTable } from "./components/customer-list-table"

import after from "virtual:medusa/widgets/customer/list/after"
import before from "virtual:medusa/widgets/customer/list/before"

export const CustomersList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CustomerListTable />
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
