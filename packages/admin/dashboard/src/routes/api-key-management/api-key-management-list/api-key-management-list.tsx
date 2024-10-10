import { useLocation } from "react-router-dom"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()
  const { getWidgets } = useDashboardExtension()

  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <SingleColumnPage
      hasOutlet
      widgets={{
        before: getWidgets("api_key.list.before"),
        after: getWidgets("api_key.list.after"),
      }}
    >
      <ApiKeyManagementListTable keyType={keyType} />
    </SingleColumnPage>
  )
}
