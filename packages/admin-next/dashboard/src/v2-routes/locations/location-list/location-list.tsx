import { Outlet } from "react-router-dom"
import { LocationsListTable } from "./components/locations-list-table"

export const LocationList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <LocationsListTable />
      <Outlet />
    </div>
  )
}
