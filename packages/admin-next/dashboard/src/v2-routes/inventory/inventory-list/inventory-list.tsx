import { InventoryListTable } from "./components/inventory-list-table"
import { Outlet } from "react-router-dom"

export const InventoryItemListTable = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <InventoryListTable />
      <Outlet />
    </div>
  )
}
