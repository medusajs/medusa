import { LocationsListTable } from "../../../modules/locations/location-list/components/locations-list-table"
import { Outlet } from "react-router-dom"

export const LocationList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <LocationsListTable />
      <Outlet />
    </div>
  )
}
