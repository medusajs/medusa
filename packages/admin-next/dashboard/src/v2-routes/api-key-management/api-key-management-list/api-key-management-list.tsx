import { Outlet } from "react-router-dom"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

// TODO: Add secret API keys

export const ApiKeyManagementList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyManagementListTable keyType="publishable" />
      {/* <ApiKeyManagementListTable keyType="secret" /> */}
      <Outlet />
    </div>
  )
}
