import { Outlet } from "react-router-dom"
import { InventoryTabs } from "./shared/components/inventory-tabs"

export function Inventory() {
  return (
    <div className="flex flex-col gap-4">
      <InventoryTabs />
      <Outlet />
    </div>
  )
}
