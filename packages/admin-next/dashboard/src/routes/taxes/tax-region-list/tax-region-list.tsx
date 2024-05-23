import { Outlet } from "react-router-dom"
import { TaxRegionListTable } from "./components/region-list-table"

export const TaxRegionsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <TaxRegionListTable />
      <Outlet />
    </div>
  )
}
