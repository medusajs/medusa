import { Outlet } from "react-router-dom"

import { CampaignListTable } from "./components/campaign-list-table"

import after from "virtual:medusa/widgets/campaign/list/after"
import before from "virtual:medusa/widgets/campaign/list/before"

export const CampaignList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CampaignListTable />
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
