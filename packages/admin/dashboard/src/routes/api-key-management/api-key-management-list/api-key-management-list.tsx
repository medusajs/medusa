import { Outlet, useLocation } from "react-router-dom"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

import after from "virtual:medusa/widgets/api_key/list/after"
import before from "virtual:medusa/widgets/api_key/list/before"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()

  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <ApiKeyManagementListTable keyType={keyType} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
