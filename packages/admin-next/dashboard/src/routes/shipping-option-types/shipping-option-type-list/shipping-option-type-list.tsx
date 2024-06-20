import { Outlet } from "react-router-dom"

import { ShippingOptionTypeListTable } from "./components/shipping-profile-list-table"

import after from "virtual:medusa/widgets/shipping_profile/list/after"
import before from "virtual:medusa/widgets/shipping_profile/list/before"

export const ShippingOptionTypeList = () => {
  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <ShippingOptionTypeListTable />
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
