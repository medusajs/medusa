import { Outlet, useLocation } from "react-router-dom"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()

  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyManagementListTable keyType={keyType} />
      <Outlet />
    </div>
  )
}
