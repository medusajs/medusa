import { Outlet } from "react-router-dom"
import { CollectionListTable } from "./components/collection-list-table"

export const CollectionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <CollectionListTable />
      <Outlet />
    </div>
  )
}
