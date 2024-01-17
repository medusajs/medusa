import { Outlet } from "react-router-dom"
import { CustomerListTable } from "./components/customer-list-table"

export const CustomersList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <CustomerListTable />
      <Outlet />
    </div>
  )
}
