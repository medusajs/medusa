import { Outlet } from "react-router-dom"
import { SalesChannelListTable } from "../../../modules/sales-channels/sales-channel-list/components"

export const SalesChannelList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <SalesChannelListTable />
      <Outlet />
    </div>
  )
}
