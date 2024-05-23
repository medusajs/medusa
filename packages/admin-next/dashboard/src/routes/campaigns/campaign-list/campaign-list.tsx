import { Outlet } from "react-router-dom"
import { CampaignListTable } from "./components/campaign-list-table"

export const CampaignList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <CampaignListTable />
      <Outlet />
    </div>
  )
}
