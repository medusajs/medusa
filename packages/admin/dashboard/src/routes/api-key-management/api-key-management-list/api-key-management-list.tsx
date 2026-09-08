import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLocation } from "react-router-dom"
import { getApiKeyTypeFromPathname } from "../common/utils"
import { ApiKeyManagementListTable } from "./components/api-key-management-list-table"
import { ConfigurableApiKeyManagementListTable } from "./components/api-key-management-list-table/configurable-api-key-management-list-table"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"

export const ApiKeyManagementList = () => {
  const { pathname } = useLocation()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  const keyType = getApiKeyTypeFromPathname(pathname)

  return (
    <LayoutComposer
      widgetsZonePrefix="api_key.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="ApiKeyManagementListTable">
            {isViewConfigEnabled ? (
              <ConfigurableApiKeyManagementListTable keyType={keyType} />
            ) : (
              <ApiKeyManagementListTable keyType={keyType} />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
