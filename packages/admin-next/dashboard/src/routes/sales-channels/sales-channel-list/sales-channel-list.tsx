import { Outlet } from "react-router-dom"
import { SalesChannelListTable } from "./components/sales-channel-list-table"

export const SalesChannelList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <SalesChannelListTable />
      <Outlet />
    </div>
  )
}
