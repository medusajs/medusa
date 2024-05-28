import { Outlet } from "react-router-dom"

import { CustomerGroupListTable } from "./components/customer-group-list-table"

import after from "virtual:medusa/widgets/customer_group/list/after"
import before from "virtual:medusa/widgets/customer_group/list/before"

export const CustomerGroupsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CustomerGroupListTable />
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
