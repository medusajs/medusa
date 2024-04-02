import { Outlet } from "react-router-dom"
import { DraftOrderListTable } from "./components/draft-order-list-table"

export const DraftOrderList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <DraftOrderListTable />
      <Outlet />
    </div>
  )
}
