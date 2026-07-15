import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLocation } from "react-router-dom"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"

import { LayoutComposer } from "../../../components/layout-composer"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()

  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <LayoutComposer
      widgetsZonePrefix="api_key.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ApiKeyManagementListTable">
            <ApiKeyManagementListTable keyType={keyType} />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
