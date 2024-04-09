import { Outlet } from "react-router-dom"
import { PricingListTable } from "./components/pricing-list-table"

export const PricingList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <PricingListTable />
      <Outlet />
    </div>
  )
}
