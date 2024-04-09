import { Outlet } from "react-router-dom"
import { CustomerGroupListTable } from "./components/customer-group-list-table"

export const CustomerGroupsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <CustomerGroupListTable />
      <Outlet />
    </div>
  )
}
