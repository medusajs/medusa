import { Outlet } from "react-router-dom"
import { GiftCardListTable } from "./components/gift-card-list-table"

export const GiftCardList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <GiftCardListTable />
      <Outlet />
    </div>
  )
}
