import { Outlet } from "react-router-dom"
import { RegionListTable } from "./components/region-list-table"

export const RegionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <RegionListTable />
      <Outlet />
    </div>
  )
}
