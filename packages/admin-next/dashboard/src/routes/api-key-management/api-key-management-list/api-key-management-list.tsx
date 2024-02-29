import { Outlet } from "react-router-dom"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

export const ApiKeyManagementList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyManagementListTable />
      <Outlet />
    </div>
  )
}
