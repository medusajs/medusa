import { Outlet } from "react-router-dom"
import { ShippingProfileListTable } from "./components/shipping-profile-list-table"

export const ShippingProfileList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <ShippingProfileListTable />
      <Outlet />
    </div>
  )
}
